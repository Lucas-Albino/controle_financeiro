<?php

namespace App\Services;

use App\Models\Category;
use App\Repositories\CategoryRepository;
use Illuminate\Database\Eloquent\Collection;

class CategoryService
{
    public function __construct(
        private readonly CategoryRepository $categoryRepository,
    ) {}

    /**
     * @return Collection<int, Category>
     */
    public function list(): Collection
    {
        return $this->categoryRepository->getAll();
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function store(array $data): Category
    {
        return $this->categoryRepository->create($data);
    }

    public function show(int $categoryId): Category
    {
        return $this->categoryRepository->findOrFail($categoryId);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(int $categoryId, array $data): Category
    {
        $category = $this->categoryRepository->findOrFail($categoryId);

        return $this->categoryRepository->update($category, $data);
    }

    public function destroy(int $categoryId): void
    {
        $category = $this->categoryRepository->findOrFail($categoryId);

        $this->categoryRepository->destroy($category);
    }
}
