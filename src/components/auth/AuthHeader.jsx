import { Link } from "react-router-dom";

const resolveAuthLink = (linkTo = "") => {
  if (!linkTo) return "/auth/login";
  if (linkTo.startsWith("/auth/")) return linkTo;
  if (linkTo.startsWith("/")) return `/auth${linkTo}`;
  return `/auth/${linkTo}`;
};

export default function AuthHeader({
  title,
  description,
  questionText,
  linkText,
  linkTo,
}) {
  return (
    <div className="flex flex-col gap-2 text-center">
      {title && <h4 className="text-2xl font-bold text-foreground">{title}</h4>}

      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}

      {questionText && linkText && linkTo && (
        <p className="text-sm text-muted-foreground">
          {questionText}{" "}
          <Link
            to={resolveAuthLink(linkTo)}
            className="text-primary font-medium hover:text-secondary transition"
          >
            {linkText}
          </Link>
        </p>
      )}
    </div>
  );
}
