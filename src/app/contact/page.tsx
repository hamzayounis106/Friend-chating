import ContactDetail from '@/components/contact/ContactDetail';
import ContactForm from '@/components/contact/ContactForm';
import ContactHero from '@/components/contact/hero/ContactHero';

const ContactPage = () => {
  return (
    <section>
      <ContactHero />
      <div className='container flex flex-col md:flex-row items-center justify-center gap-12 my-20'>
        <ContactForm />
        <ContactDetail />
      </div>
    </section>
  );
};
export default ContactPage;
