<template>
  <div>
    <h3>{{ status }}</h3>
    <div v-if="online" class="ipfs-info">
        <h3>
        ID: <span id="ipfs-info-id">{{ id }}</span>
        </h3>
        <h3>
        Agent version: <span id="ipfs-info-agent">{{ agentVersion }}</span>
        </h3>
    </div>
  </div>
</template>

<script>
import { urlSource } from "ipfs-core"
export default {
  name: "IpfsInfo",
  
  data() {
    return {
      status: "Connecting to IPFS...",
      id: "",
      agentVersion: "",
      online: false
    };
  },

  mounted() {
    this.getIpfsNodeInfo();
  },

  methods: {
    async getIpfsNodeInfo() {
      try {
        // Await for ipfs node instance.
        const ipfs = await this.$ipfs({
          //repo: "wuluwulu",
          config: { 
            //http: "/ip4/127.0.0.1/tcp/5001",
            Addresse: {
              "API": "/ip4/127.0.0.1/tcp/5001",
		"Announce": [],
		"AppendAnnounce": [],
		"Gateway": "/ip4/127.0.0.1/tcp/8080",
		"NoAnnounce": [],
		"Swarm": [
			"/ip4/0.0.0.0/tcp/4001",
			"/ip6/::/tcp/4001",
			"/ip4/0.0.0.0/udp/4001/quic",
			"/ip6/::/udp/4001/quic"
		]
            },

            "Bootstrap": [
		"/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt",
		"/ip4/104.131.131.82/tcp/4001/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ",
		"/ip4/104.131.131.82/udp/4001/quic/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ",
		"/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN",
		"/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa",
		"/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb"
	],
          }
        });
        const config = await ipfs.config.getAll()
        console.log("config", config)
        console.log("ipfs", ipfs)
        //await ipfs.files.mkdir('/my/beautiful/directory', '-p')
        // Call ipfs `id` method.
        // Returns the identity of the Peer.
        const { agentVersion, id } = await ipfs.id();
        this.agentVersion = agentVersion;
        this.id = id;
        // Set successful status text.
        this.status = "Connected to IPFS =)";
        this.online = ipfs.isOnline();
        const upload = await ipfs.add({
          path: 'hello.txt',
    content: 'Hello World 101' 
    })
        console.log("upload", upload)
        const data = await ipfs.cat(upload.path)
  console.log('Data read back via ipfs.cat:', data)
      } catch (err) {
        // Set error status text.
        this.status = `Error: ${err}`;
      }
    }
  }
};
</script>
