// ═══════════════════════════════════════════════════════════
// ClearPath AI — FAQ Accordion Item
// ═══════════════════════════════════════════════════════════

'use client';

import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

interface FAQItemProps {
  question: string;
  answer: string;
  value: string;
}

export function FAQItem({ question, answer, value }: FAQItemProps) {
  return (
    <AccordionItem
      value={value}
      className="border-white/10 px-4"
    >
      <AccordionTrigger className="text-left text-base font-medium text-white hover:no-underline hover:text-violet-400 sm:text-lg">
        {question}
      </AccordionTrigger>
      <AccordionContent className="text-sm leading-relaxed text-white/70 sm:text-base">
        {answer}
      </AccordionContent>
    </AccordionItem>
  );
}
