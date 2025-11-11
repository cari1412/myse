import Script from 'next/script'

interface StructuredDataProps {
  data: Record<string, any> | Record<string, any>[]
}

/**
 * Компонент для добавления Schema.org микроразметки
 * Поддерживает как одну схему, так и массив схем
 * Правильно работает с SSR в Next.js
 */
export default function StructuredData({ data }: StructuredDataProps) {
  // Если передан массив схем, генерируем отдельный script для каждой
  if (Array.isArray(data)) {
    return (
      <>
        {data.map((schema, index) => (
          <Script
            key={`structured-data-${index}`}
            id={`structured-data-${index}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            strategy="beforeInteractive"
          />
        ))}
      </>
    )
  }

  // Для одиночной схемы
  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      strategy="beforeInteractive"
    />
  )
}