import type { BookSpreadProps } from '../../types/book'

export function SpreadTwo({ spread }: BookSpreadProps) {
  return (
    <article className="spread spread-two">
      <header>
        <h2>{spread.title}</h2>
        <p className="subtitle">{spread.subtitle}</p>
      </header>
      <div className="spread-copy">
        {spread.paragraphs.map((text, index) => (
          <p key={index}>{text}</p>
        ))}
      </div>
    </article>
  )
}
