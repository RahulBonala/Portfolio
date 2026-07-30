import { useEffect, useRef } from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Work from '../components/Work';
import Skills from '../components/Skills';
import Approach from '../components/Approach';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';
import { useReveals } from '../hooks/useReveals';

const Home: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  useReveals(ref);

  useEffect(() => {
    document.title = 'Rahul Bonala: Product Designer & Developer';
  }, []);

  return (
    <div ref={ref}>
      <Hero />
      <About />
      <Work />
      <Skills />
      <Approach />
      <section className="section">
        <div className="container">
          <Testimonials />
        </div>
      </section>
      <Contact />
    </div>
  );
};

export default Home;
