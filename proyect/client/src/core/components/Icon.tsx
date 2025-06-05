interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;
}

export default function Icon({ name, ...props }: IconProps) {
  return (
    <span className="material-icons" {...props}>
      {name}
    </span>
  );
}
