import Main from "./main";
import StationHub from "./station";
import {
  Routes,
  Route
} from "react-router-dom";

const Hubs = () => {
	return (
		<Routes>
	        <Route path="/:hub_id" element={<Main />} />
	        <Route path="/station/:hub_id" element={<StationHub />} />
	    </Routes>
	)
}

export default Hubs;