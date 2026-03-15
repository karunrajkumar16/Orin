export default function Policies() {
    return (
        <div className="container mx-auto px-6 md:px-12 py-12 md:py-24 max-w-4xl">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight mb-4 text-center">Policies</h1>
            <p className="text-gray-500 text-center mb-16">Please read our store policies carefully.</p>

            <div className="space-y-12">
                <section className="bg-white p-8 md:p-12 border border-gray-100 shadow-sm rounded-3xl">
                    <h2 className="text-2xl font-bold text-primary mb-6">Replacement Policy</h2>

                    <div className="prose prose-lg text-gray-600">
                        <p className="font-bold text-gray-900 mb-4 text-xl">No Returns.</p>
                        <p className="mb-6">
                            Because our products are made to order and often customized, we do not accept returns or exchanges for a change of mind. Please ensure your selected options (size, color, material) are correct before placing an order.
                        </p>

                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Damaged or Defective Items</h3>
                        <p className="mb-6">
                            Replacement is allowed within <strong>72 hours</strong> if the product arrives damaged or defective.
                        </p>

                        <ul className="list-disc pl-6 space-y-2 mb-6 text-sm">
                            <li>You must contact us within 72 hours of receiving the shipment.</li>
                            <li>Provide clear photographs of both the damaged product and the original packaging.</li>
                            <li>We will arrange for a free replacement to be shipped out as soon as possible.</li>
                        </ul>

                        <p className="text-sm">
                            In cases where damage occurs post-delivery through user mishandling (such as dropping fragile PLA materials), we cannot offer free replacements, but we may offer a reprint at a discounted cost depending on the item.
                        </p>
                    </div>
                </section>

                <section className="bg-white p-8 md:p-12 border border-gray-100 shadow-sm rounded-3xl">
                    <h2 className="text-2xl font-bold text-primary mb-6">Shipping Policy</h2>
                    <div className="prose prose-lg text-gray-600 text-sm">
                        <p className="mb-4">
                            All our items are 3D printed on demand. Production typically takes 3-5 business days depending on current volume and part complexity.
                        </p>
                        <p>
                            Standard shipping takes an additional 3-5 business days. Once your item is shipped, you will receive a tracking link via email.
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}
