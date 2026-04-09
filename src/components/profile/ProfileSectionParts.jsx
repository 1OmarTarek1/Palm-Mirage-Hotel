import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { fadeUp, getStatusTone } from "./profileUtils";

export function SectionCard({ children, className, index = 0, id, highlighted = false }) {
  return (
    <motion.section
      id={id}
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className={cn(
        "scroll-mt-24 rounded-[2rem] transition-[background-color,border-color,box-shadow] duration-500",
        highlighted && "border border-primary/20 bg-primary/[0.045] shadow-[0_0_0_1px_hsl(var(--primary)/0.10)]",
        className,
      )}
    >
      {children}
    </motion.section>
  );
}

export function SectionDivider({ className }) {
  return (
    <div className={cn("py-4 sm:py-5", className)} aria-hidden="true">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-border/70 to-transparent" />
    </div>
  );
}

export function SectionHeader({
  icon: Icon,
  title,
  subtitle,
  count,
  actionLabel,
  actionTo,
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Icon size={22} />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xl font-bold text-foreground">{title}</h2>
            {count !== undefined ? (
              <span className="rounded-full border border-primary/15 bg-primary/8 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
                {count}
              </span>
            ) : null}
          </div>
          {subtitle ? (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>

      {actionLabel && actionTo ? (
        <Button asChild variant="palmSecondary" size="sm" className="self-start px-5">
          <Link to={actionTo}>{actionLabel}</Link>
        </Button>
      ) : null}
    </div>
  );
}

export function InfoCard({ icon: Icon, label, value, index, className }) {
  if (!value) return null;

  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className={cn(
        "flex items-center gap-4 rounded-2xl border border-border/40 bg-card/60 p-4 backdrop-blur-sm",
        className,
      )}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon size={20} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </p>
        <p className="mt-1 truncate text-sm font-medium text-foreground">{value}</p>
      </div>
    </motion.div>
  );
}

export function StatCard({ icon: Icon, label, value, subtitle, index, className }) {
  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className={cn(
        "flex h-full min-h-0 flex-col rounded-[1.75rem] border border-border/50 bg-card/70 p-5 shadow-sm backdrop-blur-sm",
        className,
      )}
    >
      <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:justify-between">
        <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              {label}
            </p>
            <p className="mt-3 text-3xl font-black text-foreground">{value}</p>
          </div>
          <p className="text-sm leading-snug text-muted-foreground">{subtitle}</p>
        </div>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center self-start rounded-2xl bg-primary/10 text-primary">
          <Icon size={22} />
        </div>
      </div>
    </motion.div>
  );
}

export function StatusBadge({ status, label, toneStatus, className }) {
  const normalizedStatus = label || status || "unknown";
  const toneKey = toneStatus || status || normalizedStatus;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em]",
        getStatusTone(toneKey),
        className,
      )}
    >
      {normalizedStatus}
    </span>
  );
}

export function EmptyState({ title, description, actionLabel, actionTo }) {
  return (
    <div className="rounded-[1.5rem] border border-dashed border-border/70 bg-background/40 px-5 py-10 text-center">
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
        {description}
      </p>
      {actionLabel && actionTo ? (
        <Button asChild variant="palmPrimary" size="sm" className="mt-6 px-6">
          <Link to={actionTo}>{actionLabel}</Link>
        </Button>
      ) : null}
    </div>
  );
}

export function PreviewImage({ src, alt, href }) {
  const content = src ? (
    <img src={src} alt={alt} className="h-full w-full object-cover" />
  ) : (
    <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary">
      <ShoppingBag size={18} />
    </div>
  );

  if (!href) {
    return (
      <div className="h-16 w-20 overflow-hidden rounded-2xl border border-border/40 bg-muted/30">
        {content}
      </div>
    );
  }

  return (
    <Link
      to={href}
      className="h-16 w-20 overflow-hidden rounded-2xl border border-border/40 bg-muted/30"
    >
      {content}
    </Link>
  );
}

export function CollectionRow({ title, subtitle, href, image, meta, trailing }) {
  return (
    <div className="flex items-center gap-4 rounded-[1.5rem] border border-border/40 bg-background/40 p-4">
      <PreviewImage src={image} alt={title} href={href} />

      <div className="min-w-0 flex-1">
        {href ? (
          <Link to={href} className="text-sm font-semibold text-foreground hover:text-primary">
            {title}
          </Link>
        ) : (
          <p className="text-sm font-semibold text-foreground">{title}</p>
        )}
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        {meta ? <p className="mt-2 text-xs text-muted-foreground">{meta}</p> : null}
      </div>

      {trailing ? <div className="shrink-0 text-right">{trailing}</div> : null}
    </div>
  );
}

export function BookingMeta({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Icon size={15} className="text-primary/70" />
      <span>{label}</span>
    </div>
  );
}

export function BookingActionBar({ children, className }) {
  return (
    <div className={cn("mt-5 flex flex-wrap items-center justify-between gap-3 pt-4", className)}>
      {children}
    </div>
  );
}

export function CarouselCard({ children, className }) {
  return (
    <div
      className={cn(
        "flex w-full h-full flex-col rounded-[1.75rem] border border-border/40 bg-background/45 p-5 shadow-sm backdrop-blur-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SectionCarousel({
  items = [],
  getItemKey,
  renderItem,
  itemClassName,
  contentClassName,
  className,
  stretchItems = false,
}) {
  if (!items.length) return null;

  return (
    <Carousel className={cn("w-full", className)}>
      <CarouselContent
        className={cn(
          "-ml-4 sm:-ml-6",
          stretchItems ? "items-stretch" : "items-start",
          contentClassName,
        )}
      >
        {items.map((item, index) => (
          <CarouselItem
            key={getItemKey ? getItemKey(item, index) : index}
            className={cn(
              "pl-4 sm:pl-6 md:basis-1/2 xl:basis-1/3",
              stretchItems && "flex h-auto min-h-0 self-stretch",
              itemClassName,
            )}
          >
            {renderItem(item, index)}
          </CarouselItem>
        ))}
      </CarouselContent>

      {items.length > 1 ? (
        <div className="mt-6 flex items-center justify-end gap-3">
          <CarouselPrevious className="static translate-y-0 cursor-pointer border border-primary text-primary shadow-none hover:bg-primary hover:text-white" />
          <CarouselNext className="static translate-y-0 cursor-pointer border border-primary text-primary shadow-none hover:bg-primary hover:text-white" />
        </div>
      ) : null}
    </Carousel>
  );
}
