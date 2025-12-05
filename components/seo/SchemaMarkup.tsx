'use client';

interface SchemaMarkupProps {
    schema: object | object[];
}

export function SchemaMarkup({ schema }: SchemaMarkupProps) {
    const schemaArray = Array.isArray(schema) ? schema : [schema];

    return (
        <>
            {schemaArray.map((schemaItem, index) => (
                <script
                    key={index}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(schemaItem, null, 0),
                    }}
                />
            ))}
        </>
    );
}
