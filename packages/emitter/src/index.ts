import { getPostContext } from './context';
import { emitters } from './emitters';

const emitPosts = async () => {
  const postContext = getPostContext();
  if (postContext === false) {
    console.warn('No context found to emit.');
    return;
  }
  const emittedMap = Object.entries(emitters).map(async ([emitterName, emitter]) => {
    if (await emitter(postContext)) {
      console.log(`Emitted for ${emitterName}`);
      return true;
    } else {
      console.error(`Failed to emit post for ${emitterName}`);
      return false;
    }
  });
  await Promise.all(emittedMap);
};

await emitPosts();
process.exit(0);

