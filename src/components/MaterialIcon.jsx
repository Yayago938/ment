export default function MaterialIcon({ children, filled = false, className = '' }) {
  const style = filled
    ? { fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }
    : undefined

  return (
    <span className={`material-symbols-outlined ${className}`.trim()} style={style}>
      {children}
    </span>
  )
}
