<?php

namespace App\Core;

use Closure;

final class Router
{
    private array $routes = [];

    public function get(string $path, Closure $handler): void
    {
        $this->routes['GET'][$path] = $handler;
    }

    public function post(string $path, Closure $handler): void
    {
        $this->routes['POST'][$path] = $handler;
    }

    public function put(string $path, Closure $handler): void
    {
        $this->routes['PUT'][$path] = $handler;
    }

    public function delete(string $path, Closure $handler): void
    {
        $this->routes['DELETE'][$path] = $handler;
    }

    public function dispatch(Request $req)
    {
        $method = $req->method();
        $path   = $req->path();


        if (isset($this->routes[$method][$path])) {
            $handler = $this->routes[$method][$path];
            return $handler($req);
        }

        // dynamic/prefix match: any route that ends with '/' and is a prefix of $path
        if (isset($this->routes[$method])) {
            // Sort prefix routes by length (longest first)
            $prefixes = $this->routes[$method];
            uksort($prefixes, fn($a, $b) => strlen($b) <=> strlen($a));

            foreach ($prefixes as $routePath => $handler) {
                // treat '/api/clients/' as a prefix for '/api/clients/1'
                if ($routePath !== '/' && str_ends_with($routePath, '/') && str_starts_with($path, $routePath)) {
                    return $handler($req);
                }
            }
        }

        // if path exists under a different method, return 405
        $methodsForThisPath = [];
        foreach ($this->routes as $m => $map) {
            if (isset($map[$path])) $methodsForThisPath[] = $m;
            foreach ($map as $routePath => $_) {
                if ($routePath !== '/' && str_ends_with($routePath, '/') && str_starts_with($path, $routePath)) {
                    $methodsForThisPath[] = $m;
                }
            }
        }
        if (!empty($methodsForThisPath)) {
            http_response_code(405);
            return Response::json(['error' => 'Method not allowed']);
        }

        // otherwise 404
        http_response_code(404);
        Response::json(['error' => 'Not found']);
    }
}
