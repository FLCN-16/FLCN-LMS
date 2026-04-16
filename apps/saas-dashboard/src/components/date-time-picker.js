import { useState } from "react";
import { IconCalendar, IconClock, IconX } from "@tabler/icons-react";
import { format, setHours, setMinutes } from "date-fns";
import { Button } from "@flcn-lms/ui/components/button";
import { Calendar } from "@flcn-lms/ui/components/calendar";
import { Field, FieldDescription, FieldLabel, } from "@flcn-lms/ui/components/field";
import { Input } from "@flcn-lms/ui/components/input";
import { Popover, PopoverContent, PopoverTrigger, } from "@flcn-lms/ui/components/popover";
import { Separator } from "@flcn-lms/ui/components/separator";
import { cn } from "@flcn-lms/ui/lib/utils";
// ─── DateTimePicker ──────────────────────────────────────────────────────────
export function DateTimePicker({ label, name, description, defaultValue, optional, }) {
    const [date, setDate] = useState(defaultValue ? new Date(defaultValue) : undefined);
    const [open, setOpen] = useState(false);
    function handleDaySelect(day) {
        if (!day)
            return setDate(undefined);
        setDate((prev) => setMinutes(setHours(day, prev?.getHours() ?? 0), prev?.getMinutes() ?? 0));
    }
    function handleTimeChange(e) {
        const [h, m] = e.target.value.split(":").map(Number);
        setDate((prev) => setMinutes(setHours(prev ?? new Date(), h ?? 0), m ?? 0));
    }
    const timeValue = date
        ? `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`
        : "";
    return (<Field>
      <FieldLabel>
        {label}
        {optional && (<span className="ml-1.5 text-xs font-normal text-muted-foreground">
            (optional)
          </span>)}
      </FieldLabel>

      {/* Hidden input carries the value for FormData */}
      <input type="hidden" name={name} value={date ? date.toISOString() : ""}/>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button type="button" variant="outline" data-empty={!date} className="w-full justify-start gap-2 text-left font-normal data-[empty=true]:text-muted-foreground">
            <IconCalendar className="size-4 shrink-0"/>
            {date ? format(date, "PPP, HH:mm") : "Pick a date & time"}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={date} onSelect={handleDaySelect}/>

          <Separator />

          <div className="flex items-center gap-3 p-3">
            <IconClock className="size-4 shrink-0 text-muted-foreground"/>
            <span className="text-sm text-muted-foreground">Time</span>
            <Input type="time" value={timeValue} onChange={handleTimeChange} className="h-8 w-28 text-sm"/>
            {date && (<Button type="button" variant="ghost" size="icon" className={cn("ml-auto size-7 text-muted-foreground hover:text-foreground")} onClick={() => {
                setDate(undefined);
                setOpen(false);
            }}>
                <IconX className="size-3.5"/>
              </Button>)}
          </div>
        </PopoverContent>
      </Popover>

      {description && <FieldDescription>{description}</FieldDescription>}
    </Field>);
}
// ─── DatePicker (date only, no time) ────────────────────────────────────────
export function DatePicker({ label, name, description, defaultValue, optional, }) {
    const [date, setDate] = useState(defaultValue ? new Date(defaultValue) : undefined);
    const [open, setOpen] = useState(false);
    return (<Field>
      <FieldLabel>
        {label}
        {optional && (<span className="ml-1.5 text-xs font-normal text-muted-foreground">
            (optional)
          </span>)}
      </FieldLabel>

      <input type="hidden" name={name} value={date ? format(date, "yyyy-MM-dd") : ""}/>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button type="button" variant="outline" data-empty={!date} className="w-full justify-start gap-2 text-left font-normal data-[empty=true]:text-muted-foreground">
            <IconCalendar className="size-4 shrink-0"/>
            {date ? format(date, "PPP") : "Pick a date"}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={date} onSelect={(d) => {
            setDate(d);
            setOpen(false);
        }}/>
          {date && (<div className="border-t p-2">
              <Button type="button" variant="ghost" size="sm" className="w-full text-xs text-muted-foreground" onClick={() => {
                setDate(undefined);
                setOpen(false);
            }}>
                Clear
              </Button>
            </div>)}
        </PopoverContent>
      </Popover>

      {description && <FieldDescription>{description}</FieldDescription>}
    </Field>);
}
