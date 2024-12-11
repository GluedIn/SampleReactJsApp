import parse from "html-react-parser";

export const getVideosData = (videos: any, len: any = 0) => {
  try {
    return videos
      .filter((video: any) => video.contentType === "video")
      .map((video: any, index: number) => {
        const {
          videoId,
          thumbnailUrl,
          contentUrls: [
            { urls: [smallVideoUrl = "", largeVideoUrl = ""] } = { urls: [] },
          ] = [],
        } = video ?? {};

        const isYoutubeVideo =
          smallVideoUrl.includes("youtube") ||
          largeVideoUrl.includes("youtube");

        let youtubeVideoId = "";
        if (isYoutubeVideo) {
          const splittedUrl = smallVideoUrl.split("/");
          youtubeVideoId = splittedUrl[splittedUrl.length - 1];
        }

        return {
          ...video,
          indexNo: len + index,
          id: `${videoId}-${len + index}`,
          playing: false,
          muted: len + index === 0 ? true : false,
          url: smallVideoUrl,
          //   url: video?.contentUrls[0]?.urls?.find((url: string) => url.includes('.m3u8')),
          thumbnailUrl: thumbnailUrl,
          isYoutubeVideo: isYoutubeVideo,
          youtubeVideoId: isYoutubeVideo ? youtubeVideoId : "",
        };
      });
  } catch (error) {
    console.error(error);
  }
};

export const parseDescription = (description: string, taggedUsers: any) => {
  const regex = /(#[^\s]+)|(@[^\s]+)/g;
  let hasTags = false;
  const descriptionWithAnchorTags = description?.replace(regex, (match) => {
    if (match.startsWith("#")) {
      hasTags = true;
      return `<a href="/hashtag/${match.slice(1)}">${match}</a>`;
    } else if (match.startsWith("@")) {
      hasTags = true;
        //   const taggedUser = taggedUsers?.find((user:any)=> user?.userName?.replace(" ","")?.replace("@","") === match?.replace(" ","")?.replace("@",""));
      const taggedUser = taggedUsers?.find((user: any) => 
        user?.userName?.replace(/[@\s]/g, "") === match?.replace(/[@\s]/g, "") ?? ""
      );
      return `<a href="/profile/${taggedUser?.userId}">${match}</a>`;
    } else {
      return match;
    }
  });

  if (hasTags) {
    return parse(descriptionWithAnchorTags);
  }

  return description;
};

export const convertKToNumeric = (kValue: any) => {
  if (typeof kValue === "string" && kValue.match(/(\d+(\.\d+)?)(K|M|B)?/)) {
    let match: any = kValue.match(/(\d+(\.\d+)?)(K|M|B)?/);
    let numericValue = parseFloat(match[1]);
    let modifier = match[3];
    if (modifier) {
      if (modifier === "K") {
        numericValue *= 1000;
      } else if (modifier === "M") {
        numericValue *= 1000000;
      } else if (modifier === "B") {
        numericValue *= 1000000000;
      }
    }
    return numericValue;
  }
  return null;
};

export const formatLargeNumber = (count: number) => {
  if (count < 1000) {
    return count.toString();
  } else if (count < 1000000) {
    return (count / 1000).toFixed(1) + "K";
  } else {
    return (count / 1000000).toFixed(1) + "M";
  }
};
