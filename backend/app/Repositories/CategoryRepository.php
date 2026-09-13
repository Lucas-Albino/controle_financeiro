<?php

namespace App\Repositories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Collection;

class CategoryRepository
{
    /**
     * @return Collection<int, Category>
     */
    public function getAll(): Collection
    {
        return Category::query()
            ->orderBy('name')
            ->orderBy('id')
            ->get();
    }

    public function findOrFail(int $categoryId): Category
    {
        return Category::query()->findOrFail($categoryId);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Category
    {
        return Category::query()->create($data);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(Category $category, array $data): Category
    {
        $category->update($data);

        return $category->refresh();
    }

    public function destroy(Category $category): void
    {
        $category->delete();
    }
}
