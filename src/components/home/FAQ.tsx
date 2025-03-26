import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQ = () => {
  const faqItems = [
    {
      question: 'Is posting my procedure really free?',
      answer:
        'Yes, posting your procedure is completely free. You can create a listing and invite surgeons without any charges.',
    },
    {
      question: 'Do I pay more for multiple surgeon replies?',
      answer:
        'No, you pay a single fee per procedure that unlocks all surgeon responses. There are no additional charges for multiple replies.',
    },
    {
      question: 'How does escrow protect me?',
      answer:
        "Your payment is held securely in escrow until after your procedure is completed satisfactorily. This ensures you only pay when you're happy with the results.",
    },
    {
      question: 'What happens if the surgeon wants more money later?',
      answer:
        'All costs are agreed upon upfront and documented in your contract. Any additional charges would need to be mutually agreed upon and would go through the same escrow protection process.',
    },
    {
      question: 'How do I invite surgeons?',
      answer:
        'After posting your procedure, you can browse our verified surgeon network and send invitations directly through our platform. Surgeons can also discover and respond to your listing.',
    },
  ];

  return (
    <div className='max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8'>
      <h2 className='text-3xl font-bold text-center mb-8'>
        Frequently Asked Questions
      </h2>
      <Accordion type='single' collapsible className='w-full'>
        {faqItems.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className='text-left hover:no-underline'>
              <span className='font-medium text-lg'>{item.question}</span>
            </AccordionTrigger>
            <AccordionContent className='text-muted-foreground'>
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default FAQ;
