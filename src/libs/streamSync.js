import LB from "../backend/local/";
const id = (i) => `stream_${i}`;

const sync = (localStreams, remoteStreams) => {
	const streamsToAdd = [];
	const streamsToRemove = [];
	for(const remoteStream of remoteStreams){
		const ruuid = id(remoteStream.id);
		const found = localStreams.find(({ uuid }) => uuid === ruuid);
		if(!found){
			LB.Stream.addStream({
				uuid: ruuid,
				name: remoteStream.name,
				rtspUrl: remoteStream.rtspUrl,
			});
			streamsToAdd.push(remoteStream);
		}
	}

	for(const localStream of localStreams){
		const found = remoteStreams.find((rstream) => id(rstream.id) === localStream.uuid);
		if(!found){
			LB.Stream.deleteStream(localStream.uuid);
			streamsToRemove.push(localStream);
		}
	}

	return true;
}

export default sync;