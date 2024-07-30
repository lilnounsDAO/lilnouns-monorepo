import { useAppSelector } from '../../hooks';
import { useBuyNoun } from '../../hooks/useBuyNoun';
import { INoun } from '../StandaloneNoun';

export const AuctionPreviousNouns = () => {
  const previousNouns = useAppSelector(state => state.auction.nouns?.previous);

  return (
    <section className="py-16 bg-gray-100">
      <div className="container-lg">
        <h2 className="font-londrina text-4xl text-neutral-800 text-center">Previous Lil Nouns</h2>
        <h3 className="text-center text-neutral-600 text-xl font-ptRoot">
          You may also want to mint one of 3 Lil Nouns generated in previous blocks.
        </h3>
        <div className="grid gap-8 lg:grid-cols-3 lg:gap-3 mt-8">
          {!previousNouns?.length && (
            <>
              <div className="animate-pulse bg-zinc-300 w-full aspect-square rounded-xl" />
              <div className="animate-pulse bg-zinc-300 w-full aspect-square rounded-xl" />
              <div className="animate-pulse bg-zinc-300 w-full aspect-square rounded-xl" />
            </>
          )}
          {previousNouns?.map(noun => (
            <PreviousNoun noun={noun} key={noun.blockNumber} />
          ))}
        </div>
      </div>
    </section>
  );
};

const PreviousNoun = (props: { noun: INoun }) => {
  const { image, name, blockNumber } = props.noun;

  const { buyNoun, isLoading } = useBuyNoun();

  return (
    <div>
      <div className="aspect-square bg-white w-full">
        <img
          src={image}
          alt={name}
          width={512}
          height={512}
          className="w-full object-cover rounded-md h-full"
        />
      </div>
      <div className="mt-3 text-center">
        <button
          type="button"
          className="py-2 px-4 font-bold text-center text-white rounded-xl border-none hover:opacity-80 duration-100"
          style={{ backgroundColor: 'var(--brand-dark-red)' }}
          onClick={() => buyNoun(blockNumber!)}
          disabled={isLoading}
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};
