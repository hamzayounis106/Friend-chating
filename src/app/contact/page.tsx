import ContactForm from '@/components/contact/ContactForm';
import ContactHero from '@/components/contact/hero/ContactHero';

const ContactPage = () => {
  return (
    <section>
      <ContactHero />
      <div className='container flex flex-col items-center justify-center gap-12 my-20'>
        <ContactForm />
      </div>
    </section>
  );
};
export default ContactPage;
