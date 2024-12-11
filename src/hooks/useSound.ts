import gluedin from "gluedin-shorts-js";
import { useEffect, useState } from "react";

const soundModule = new gluedin.GluedInSoundModule();
const Limit = 12;

export default function useSound(soundId: string) {
  const [sound, setSound] = useState<any>({});
  const [videosListBySound, setVideosListBySound] = useState<any>([]);

  useEffect(() => {
    const fetchSoundDetails = async () => {
      try {
        const soundDetails = await soundModule.getSoundDetailById(soundId);
        if (soundDetails.data.statusCode === 2001) {
          setSound(soundDetails.data.result);
        }
      } catch (error) {
        console.error(error);
      }
    };

    const fetchVideoListBySound = async () => {
      try {
        const {
          data: { statusCode, result: videosList },
        } = await soundModule.fetchVideoListBySoundId({
          limit: Limit,
          offset: 1,
          soundId: soundId,
        });

        if (statusCode === 2004) {
          setVideosListBySound(videosList);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (soundId) {
      fetchSoundDetails();
      fetchVideoListBySound();
    }
  }, [soundId]);

  return { sound: sound, videos: videosListBySound };
}
