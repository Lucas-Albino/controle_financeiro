<?php

namespace Tests\Feature\Http\Controllers\Api;

use App\Models\Category;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Tests\TestCase;

class CategoryControllerTest extends TestCase
{
    use LazilyRefreshDatabase;

    public function test_create_endpoint_is_not_available(): void
    {
        $response = $this->getJson('/api/categories/create');

        $response->assertNotFound();
    }

    public function test_list_returns_categories_ordered_by_name(): void
    {
        Category::factory()->create(['name' => 'Transporte']);
        Category::factory()->create(['name' => 'Alimentação']);

        $response = $this->getJson(route('categories.list'));

        $response
            ->assertOk()
            ->assertJsonCount(2, 'data');
        $this->assertSame(
            ['Alimentação', 'Transporte'],
            $response->json('data.*.name'),
        );
    }

    public function test_show_returns_selected_category(): void
    {
        $category = Category::factory()->create([
            'name' => 'Salário',
            'type' => 'income',
            'description' => 'Receita mensal',
            'status' => 'active',
        ]);

        $response = $this->getJson(route('categories.show', $category));

        $response
            ->assertOk()
            ->assertJsonPath('data.id', $category->id)
            ->assertJsonPath('data.name', 'Salário')
            ->assertJsonPath('data.type', 'income')
            ->assertJsonPath('data.description', 'Receita mensal')
            ->assertJsonPath('data.status', 'active');
    }

    public function test_show_returns_404_when_category_does_not_exist(): void
    {
        $response = $this->getJson(route('categories.show', 999));

        $response->assertNotFound();
    }

    public function test_valid_payload_creates_category_and_returns_201(): void
    {
        $payload = [
            'name' => 'Moradia',
            'type' => 'expense',
            'description' => 'Aluguel e condomínio',
            'status' => 'active',
        ];

        $response = $this->postJson(route('categories.store'), $payload);

        $response
            ->assertCreated()
            ->assertJsonPath('data.name', 'Moradia')
            ->assertJsonPath('data.type', 'expense');
        $this->assertDatabaseHas('categories', $payload);
    }

    public function test_store_returns_422_when_required_fields_are_missing(): void
    {
        $response = $this->postJson(route('categories.store'), []);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['name', 'type', 'status'])
            ->assertJsonPath(
                'errors.name.0',
                'Informe o nome da categoria.',
            );
        $this->assertDatabaseCount('categories', 0);
    }

    public function test_store_returns_422_when_values_exceed_allowed_limits(): void
    {
        $response = $this->postJson(route('categories.store'), [
            'name' => str_repeat('a', 256),
            'type' => 'other',
            'description' => str_repeat('a', 1001),
            'status' => 'archived',
        ]);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'name',
                'type',
                'description',
                'status',
            ])
            ->assertJsonPath(
                'errors.type.0',
                'O tipo deve ser receita ou despesa.',
            )
            ->assertJsonPath(
                'errors.status.0',
                'A situação deve ser ativa ou inativa.',
            );
        $this->assertDatabaseCount('categories', 0);
    }

    public function test_valid_payload_updates_category(): void
    {
        $category = Category::factory()->create([
            'name' => 'Lazer',
            'status' => 'inactive',
        ]);
        $payload = [
            'name' => 'Entretenimento',
            'type' => 'expense',
            'description' => 'Cinema e viagens',
            'status' => 'active',
        ];

        $response = $this->putJson(
            route('categories.update', $category),
            $payload,
        );

        $response
            ->assertOk()
            ->assertJsonPath('data.id', $category->id)
            ->assertJsonPath('data.name', 'Entretenimento')
            ->assertJsonPath('data.status', 'active');
        $this->assertDatabaseHas('categories', [
            'id' => $category->id,
            ...$payload,
        ]);
    }

    public function test_update_returns_422_when_required_fields_are_missing(): void
    {
        $category = Category::factory()->create();

        $response = $this->putJson(route('categories.update', $category), []);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['name', 'type', 'status']);
        $this->assertModelExists($category);
    }

    public function test_destroy_removes_category_and_returns_204(): void
    {
        $category = Category::factory()->create();

        $response = $this->deleteJson(route('categories.destroy', $category));

        $response->assertNoContent();
        $this->assertModelMissing($category);
    }
}
