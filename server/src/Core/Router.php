<?php

namespace App\Core;

use Closure;

final class Router {
    private array $routes = [];

    public function get(string $path, Closure $handler): void {
        $this->routes['GET'][$path] = $handler;
    }

    public function post(string $path, Closure $handler): void {
        $this->routes['POST'][$path] = $handler;
    }

    public function put(string $path, Closure $handler): void {
        $this->routes['PUT'][$path] = $handler;
    }

    public function delete(string $path, Closure $handler): void {
        $this->routes['DELETE'][$path] = $handler;
    }

    public function dispatch(Request $req): void {
        $method = $req->method();
        $path = $req->path();

        $methodsForPath = array_filter(
            $this->routes,
            fn($routes) => array_key_exists($path, $routes)
        );

        if(empty($methodsForPath)) {
            http_response_code(404);
            Response::json(['error' => 'Not Found']);
        }

        if(!isset($this->routes[$method][$path])) {
            http_response_code(405);
            Response::json(['error' => 'Method Not Allowed']);
        }

        $handler = $this->routes[$method][$path];
        $handler($req);
    }
}