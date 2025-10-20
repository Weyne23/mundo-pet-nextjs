'use client';

import { Calendar as IconCalendar, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { addDays, format, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar } from '../ui/calendar';
import { NavigationButton } from './navigation-button';

export const DatePicker = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dateParams = searchParams.get('date');

  const getInitialDate = useCallback(() => {
    if (!dateParams) return;

    const [year, month, day] = dateParams.split('-').map(Number);
    const parsedDate = new Date(year, month - 1, day);

    if (!isValid(parsedDate)) return new Date();

    return parsedDate;
  }, [dateParams]);

  const [date, setDate] = useState<Date | undefined>(getInitialDate);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const updateURLWithDate = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;

    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('date', format(selectedDate, 'yyyy-MM-dd'));
    router.push(`${pathname}?${newParams.toString()}`);
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    updateURLWithDate(selectedDate);
    setIsPopoverOpen(false);
  }

  useEffect(() => {
    const newDate = getInitialDate();

    if (date?.getTime() != newDate?.getTime()) {
      setDate(newDate);
    }
  }, [date, getInitialDate]);

  const handleNavigateDay = (days: number) => {
    const newDate = addDays(date || new Date(), days);
    updateURLWithDate(newDate);
  };

  return (
    <div className="flex items-center gap-2">
      <NavigationButton tooltipText='Dia anterior' onClick={() => handleNavigateDay(-1)}>
        <ChevronLeft className="h-4 w-4 " />
      </NavigationButton>

      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-min[180px] justify-between text-left font-normal bg-transparent border-border-primary text-content-primary hover:bg-background-tertiary hover:border-border-secondary hover:text-content-primary focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-border-brand focus:border-border-brand focus-visible:border-border-brand"
          >
            <div className="flex items-center gap-2">
              <IconCalendar className="h-4 w-4 text-content-brand" />
              {date ? (
                format(date, 'dd/MM/yyyy')
              ) : (
                <span>Selecione uma data</span>
              )}
            </div>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0'>
          <Calendar
            mode='single'
            selected={date}
            onSelect={handleDateSelect}
            autoFocus
            locale={ptBR}
          />
        </PopoverContent>
      </Popover>

      <NavigationButton tooltipText='Próximo dia' onClick={() => handleNavigateDay(1)}>
        <ChevronRight className="h-4 w-4" />
      </NavigationButton>
    </div>
  );
};
