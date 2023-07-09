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
  .get("/youtube/search/", async (context) => {
    if (context?.request?.url?.searchParams) {
      const query = context.request.url.searchParams.get('query');
      if (query) {
        const results = await youtube.search(query);
        context.response.body = results;
      }
    }
  })
  .get("/youtube/video/", async (context) => {
    if (context?.request?.url?.searchParams) {
      const id = context.request.url.searchParams.get('id');
      if (id) {
        const videoInfo = await youtube.getBasicInfo(id);
        context.response.body = videoInfo;
      }
    }
  }).get("/youtube/comments/", async (context) => {
    if (context?.request?.url?.searchParams) {
      const id = context.request.url.searchParams.get('id');
      if (id) {
        const comments = await youtube.getComments(id);
        context.response.body = comments;
      }
    }
  }).get("/youtube/channel/", async (context) => {
    if (context?.request?.url?.searchParams) {
      const id = context.request.url.searchParams.get('id');
      if (id) {
        const channelInfo = await youtube.getChannel(id);
        context.response.body = channelInfo;
      }
    }
  }).get("/youtube/playlist/", async (context) => {
    if (context?.request?.url?.searchParams) {
      const id = context.request.url.searchParams.get('id');
      if (id) {
        const playlistInfo = await youtube.getPlaylist(id);
        context.response.body = playlistInfo;
      }
    }
  }).get("/youtube/advanced/", async (context) => {
    if (context?.request?.url?.searchParams) {
      const id = context.request.url.searchParams.get('id');
      if (id) {
        const basicInfo = await youtube.getBasicInfo(id);
        const comments = await youtube.getComments(id);
        const videoInfo = await youtube.getInfo(id);

        context.response.body = {
          basicInfo,
          comments,
          videoInfo
        };
      }
    }
  })


const app = new Application();
app.use(oakCors()); // Enable CORS for All Routes
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
