import { CreateProductAction } from "@/actions/products/products.actions";

const CreateNewProductRoute = () => {
  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>

      <form action={CreateProductAction} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Product Name</label>
          <input
            name="name"
            type="text"
            required
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Price</label>
          <input
            name="price"
            type="number"
            step="0.01"
            required
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Image URL</label>
          <input
            name="image"
            type="text"
            placeholder="https://example.com/image.jpg"
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded-md"
        >
          Create Product
        </button>
      </form>
    </div>
  );
};

export default CreateNewProductRoute;
