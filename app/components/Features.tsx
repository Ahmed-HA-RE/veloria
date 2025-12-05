import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { Card, CardContent } from '@/app/components/ui/card';
import { featuresItems } from '@/lib/utils';

const Features = () => {
  return (
    <section className='py-6 pt-14 md:pt-10 md:pb-6'>
      {/* Header */}
      <div className='mx-auto mb-8 md:mb-12 text-center'>
        <h2 className='text-2xl font-semibold md:text-3xl lg:text-4xl mb-3'>
          Enjoy the finest features with our products
        </h2>
        <p className='text-muted-foreground text-base md:text-lg lg:text-xl mx-auto'>
          We provide all the advantages that can simplify all your financial
          transactions without any further requirements.
        </p>
      </div>

      <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4'>
        {featuresItems.map((item, index) => {
          const IconComponent = item.icon;

          return (
            <Card
              key={index}
              className='hover:bg-amber-400 hover:text-primary-foreground group transition-colors duration-300'
            >
              <CardContent>
                <Avatar className='mb-4 size-9'>
                  <AvatarFallback className='bg-gray-100 hover:bg-white text-card-foreground [&>svg]:size-6'>
                    <IconComponent />
                  </AvatarFallback>
                </Avatar>
                <h6 className='mb-2 text-lg font-semibold'>{item.title}</h6>
                <p className='text-muted-foreground group-hover:text-primary-foreground transition-colors duration-300'>
                  {item.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default Features;
