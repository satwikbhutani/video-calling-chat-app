import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";

import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";

import ChatLoader from "../components/ChatLoader";
import CallButton from "../components/CallButton";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;


const ChatPage = () => {
  const { id: targetUserId } = useParams();

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const {data,isLoading,error} = useQuery({
      queryKey: ["authUser"],
      queryFn: async () => {
      try{
        const response = await axiosInstance.get('/auth/me')
        console.log(response.data)
        return response.data
      }
      catch(err) {
        return null;
      }},
      retry: false
    });
    const authUser=data?.user;

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: async () =>{
      const response= await axiosInstance.get('/chat/token');
      return response?.data;
    },
    enabled: !!authUser, // this will run only when authUser is available
  });

  useEffect(() => {
    const initChat = async () => {
      if (!tokenData?.token || !authUser) return;

      try {
        console.log("Initializing stream chat client...");

        const client = StreamChat.getInstance(STREAM_API_KEY);

        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic,
          },
          tokenData.token
        );

        const channelId = [authUser._id, targetUserId].sort().join("-");

        const currChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });

        await currChannel.watch();

        setChatClient(client);
        setChannel(currChannel);
      } catch (error) {
        console.error("Error initializing chat:", error);
        toast.error("Could not connect to chat. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    initChat();
  }, [tokenData, authUser, targetUserId]);

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;

      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });

      toast.success("Video call link sent successfully!");
    }
  };

  if (loading || !chatClient || !channel) return <ChatLoader />;

  return (
  <div className="min-h-screen sm:min-h-full bg-base-200 flex items-center justify-center px-4 py-6">
    <div className="w-full max-w-5xl h-[80vh] bg-base-100 rounded-xl shadow-xl border border-base-300 overflow-hidden flex flex-col">
      <Chat client={chatClient} theme="messaging light">
        <Channel channel={channel}>
          <div className="w-full h-full relative flex flex-col">
            <div className="bg-base-100 z-10">
              <CallButton handleVideoCall={handleVideoCall} />
            </div>
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
            <Thread />
          </div>
        </Channel>
      </Chat>
    </div>
  </div>
);

};
export default ChatPage;