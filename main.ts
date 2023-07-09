import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import { Innertube } from 'https://deno.land/x/youtubei/deno.ts';
import data from "./data.json" assert { type: "json" };

const youtube = await Innertube.create();

const router = new Router();
router
  .get("/", (context) => {
    context.response.body = "Welcome to dinosaur API!";
  })
  .get("/youtube/search/:query", async (context) => {
    if (context?.params?.query) {
      const results = await youtube.search(context.params.query);
      context.response.body = results;
    }
  })
  .get("/youtube/video/:id", async (context) => {
    if (context?.params?.id) {
      const videoInfo = await youtube.getBasicInfo(context.params.id);
      context.response.body = videoInfo;
    }
  }).get("/youtube/comments/:id", async (context) => {
    if (context?.params?.id) {
      const comments = await youtube.getComments(context.params.id);
      context.response.body = comments;
    }
  }).get("/youtube/channel/:id", async (context) => {
    if (context?.params?.id) {
      const channelInfo = await youtube.getChannel(context.params.id);
      context.response.body = channelInfo;
    }
  }).get("/youtube/playlist/:id", async (context) => {
    if (context?.params?.id) {
      const playlistInfo = await youtube.getPlaylist(context.params.id);
      context.response.body = playlistInfo;
    }
  }).get("/youtube/advanced/:id", async (context) => {
    if (context?.params?.id) {
      const videoId = context.params.id;
      const basicInfo = await youtube.getBasicInfo(videoId);
      const comments = await youtube.getComments(videoId);
      const videoInfo = await youtube.getInfo(videoId);

      context.response.body = {
        basicInfo,
        comments,
        videoInfo
      };
    }
  })


const app = new Application();
app.use(oakCors()); // Enable CORS for All Routes
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
