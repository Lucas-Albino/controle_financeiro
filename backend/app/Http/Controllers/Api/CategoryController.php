<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Services\CategoryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class CategoryController extends Controller
{
    public function __construct(
        private readonly CategoryService $categoryService,
    ) {}

    public function list(): AnonymousResourceCollection
    {
        return CategoryResource::collection($this->categoryService->list());
    }

    public function store(StoreCategoryRequest $request): JsonResponse
    {
        return (new CategoryResource(
            $this->categoryService->store($request->validated()),
        ))->response()->setStatusCode(Response::HTTP_CREATED);
    }

    public function show(int $category): CategoryResource
    {
        return new CategoryResource($this->categoryService->show($category));
    }

    public function update(UpdateCategoryRequest $request, int $category): CategoryResource
    {
        return new CategoryResource(
            $this->categoryService->update($category, $request->validated()),
        );
    }

    public function destroy(int $category): Response
    {
        $this->categoryService->destroy($category);

        return response()->noContent();
    }
}
