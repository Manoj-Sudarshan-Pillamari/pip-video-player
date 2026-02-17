import { useState, useEffect } from "react";
import axios from "axios";
import { PipVideoPlayer } from "./PipVideoPlayer";
import "./PipVideoPlayer.css";

const API_URL = import.meta.env.VITE_PIP_VIDEOS_API_URL;

export default function App() {
  const [mediaData, setMediaData] = useState([]);
  const [isDataReady, setIsDataReady] = useState(false);

  useEffect(() => {
    const fetchPipVideos = async () => {
      try {
        const res = await axios.get(API_URL);
        const videos = res?.data?.data;

        if (!videos || !Array.isArray(videos) || videos?.length === 0) {
          setMediaData([]);
          setIsDataReady(true);
          return;
        }

        const transformedData = videos?.map((item) => ({
          id: item._id,
          src: item.media?.url || "",
          type: item.media?.type || "video",
          redirectUrl: item?.link || "",
          rank: item?.rank,
        }));

        const validData = transformedData?.filter((item) => item?.src);

        setMediaData(validData);
      } catch (err) {
        console.error("Failed to fetch PiP videos:", err);
        setMediaData([]);
      } finally {
        setIsDataReady(true);
      }
    };

    fetchPipVideos();
  }, []);

  const handlePlayerClose = () => {
    console.log("PiP player closed");
  };

  return (
    <div className="app-container">
      <div className="content-wrapper">
        <h1 className="main-title">PiP Video Player App</h1>
        <p className="main-description">
          orem ipsum (/ˌlɔː.rəm ˈɪp.səm/ LOR-əm IP-səm) is a dummy or
          placeholder text commonly used in graphic design, publishing, and web
          development. Its purpose is to permit a page layout to be designed,
          independently of the copy that will subsequently populate it, or to
          demonstrate various fonts of a typeface without meaningful text that
          could be distracting. Lorem ipsum is typically a corrupted version of
          De finibus bonorum et malorum, a 1st-century BC text by the Roman
          statesman and philosopher Cicero, with words altered, added, and
          removed to make it nonsensical and improper Latin. The first two words
          are the truncation of dolorem ipsum ("pain itself"). Versions of the
          Lorem ipsum text have been used in typesetting since the 1960s, when
          advertisements for Letraset transfer sheets popularized it.[1] Lorem
          ipsum was introduced to the digital world in the mid-1980s, when Aldus
          employed it in graphic and word-processing templates for its desktop
          publishing program PageMaker. Other popular word processors, including
          Pages and Microsoft Word, have since adopted Lorem ipsum,[2] as have
          many LaTeX packages,[3][4][5] web content managers such as Joomla! and
          WordPress, and CSS libraries such as Semantic UI. Example text A
          common form of Lorem ipsum reads: Lorem ipsum dolor sit amet,
          consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
          labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
          exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
          dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
          proident, sunt in culpa qui officia deserunt mollit anim id est
          laborum. Source text The Lorem ipsum text is derived from sections
          1.10.32 and 1.10.33 of Cicero's De finibus bonorum et malorum.[6][7]
          The physical source may have been the 1914 Loeb Classical Library
          edition of De finibus, where the Latin text, presented on the
          left-hand (even) pages, breaks off on page 34 with "Neque porro
          quisquam est qui do-" and continues on page 36 with "lorem ipsum ...,"
          suggesting that the galley type of that page was mixed up to make the
          dummy text seen today.[1] The discovery of the text's origin is
          attributed to Richard McClintock, a Latin scholar at Hampden–Sydney
          College. McClintock connected Lorem ipsum to Cicero's writing sometime
          before 1982 while searching for instances of the Latin word
          consectetur, which was rarely used in classical literature.[2]
          McClintock first published his discovery in a 1994 letter to a Before
          & After magazine editor,[8] contesting the editor's earlier claim that
          Lorem ipsum had no meaning.[2] The relevant section of Cicero as
          printed in the source is reproduced below with fragments used in Lorem
          ipsum underlined. Letters in brackets were added to Lorem ipsum and
          were not present in the source text: [32] Sed ut perspiciatis, unde
          omnis iste natus error sit voluptatem accusantium doloremque
          laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore
          veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo
          enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut
          fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem
          sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia
          dolor sit amet consectetur adipisci[ng] velit, sed quia non numquam
          [do] eius modi tempora inci[di]dunt, ut labore et dolore magnam
          aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum[d]
          exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex
          ea commodi consequatur? [D]Quis autem vel eum i[r]ure reprehenderit,
          qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel
          illum, qui dolorem eum fugiat, quo voluptas nulla pariatur? [33] At
          vero eos et accusamus et iusto odio dignissimos ducimus, qui
          blanditiis praesentium voluptatum deleniti atque corrupti, quos
          dolores et quas molestias excepturi sint, obcaecati cupiditate non
          provident, similique sunt in culpa, qui officia deserunt mollitia
          animi, id est laborum et dolorum fuga. Et harum quidem reru[d]um
          facilis est e[r]t expedita distinctio. Nam libero tempore, cum soluta
          nobis est eligendi optio, cumque nihil impedit, quo minus id, quod
          maxime placeat facere possimus, omnis voluptas assumenda est, omnis
          dolor repellend[a]us. Temporibus autem quibusdam et aut officiis
          debitis aut rerum necessitatibus saepe eveniet, ut et voluptates
          repudiandae sint et molestiae non recusandae. Itaque earum rerum hic
          tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores
          alias consequatur aut perferendis doloribus asperiores repellat. What
          follows is H. Rackham [Wikidata]'s translation, as printed in the 1914
          Loeb edition, with words at least partially represented in Lorem ipsum
          underlined:[7] [32] But I must explain to you how all this mistaken
          idea of reprobating pleasure and extolling pain arose. To do so, I
          will give you a complete account of the system and expound the
          teachings of the great explorer of the truth, the master-builder of
          human happiness. No one rejects, dislikes or avoids pleasure itself,
          because it is pleasure, but because those who do not know how to
          pursue pleasure rationally encounter extremely painful consequences.
          Nor again is there anyone who loves or pursues or desires to obtain
          pain of itself, because it is pain, but occasionally circumstances
          occur in which toil and pain can procure him some great pleasure. To
          take a trivial example, which of us ever undertakes laborious physical
          exercise, except to obtain some advantage? But who has any right to
          find fault with a man who chooses to enjoy a pleasure tha
        </p>
      </div>

      {isDataReady && mediaData?.length > 0 && (
        <PipVideoPlayer media={mediaData} onClose={handlePlayerClose} />
      )}
    </div>
  );
}
