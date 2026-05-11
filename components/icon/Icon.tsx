type IconProps = {
  name: string;
}

export function Icon({ name }: IconProps) {
  return (
    <span className="material-symbols-outlined">{name}</span>
  )
}
