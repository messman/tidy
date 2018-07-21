import * as React from "react";

import "./wave.scss";
import { WaterLevel } from "../../../services/noaa";

interface WaveProps {
	waterLevel: WaterLevel
}

interface WaveState {

}

export class Wave extends React.Component<WaveProps, WaveState> {

	private static rock_svg =
		<svg className="rocks" width="319px" height="378px" viewBox="0 0 319 378" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMaxYMin meet">
			<defs>
				<rect id="path-1" x="0" y="0" width="355" height="378"></rect>
				<path d="M25.5920085,40.9675901 C36.2708429,40.9675901 44.9277486,33.3920891 44.9277486,24.0472351 C44.9277486,14.702381 36.2708429,7.12688003 25.5920085,7.12688003 C26.4706716,14.235094 27.0627795,21.4776038 27.3683322,28.8544096 C21.1489474,24.5694684 15.3305532,19.6656617 9.91314964,14.1429896 C7.61234935,16.9272569 6.25626837,20.3486638 6.25626837,24.0472351 C6.25626837,33.3920891 14.9131741,40.9675901 25.5920085,40.9675901 Z" id="path-3"></path>
				<path d="M25.5920085,40.9675901 C36.2708429,40.9675901 44.9277486,33.3920891 44.9277486,24.0472351 C44.9277486,14.702381 36.2708429,7.12688003 25.5920085,7.12688003 C26.4706716,14.235094 27.0627795,21.4776038 27.3683322,28.8544096 C21.1489474,24.5694684 15.3305532,19.6656617 9.91314964,14.1429896 C7.61234935,16.9272569 6.25626837,20.3486638 6.25626837,24.0472351 C6.25626837,33.3920891 14.9131741,40.9675901 25.5920085,40.9675901 Z" id="path-5"></path>
				<ellipse id="path-7" cx="10.3919598" cy="10.350051" rx="10.3919598" ry="10.350051"></ellipse>
				<ellipse id="path-9" cx="10.3919598" cy="10.350051" rx="10.3919598" ry="10.350051"></ellipse>
			</defs>
			<g id="Redesign" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
				<g id="Scene" transform="translate(-36.000000, 0.000000)">
					<mask id="mask-2" fill="white">
						<use xlinkHref="#path-1"></use>
					</mask>
					<g id="Rectangle-8"></g>
					<g id="Beach" mask="url(#mask-2)">
						<g transform="translate(19.000000, 87.000000)">
							<path d="M258.182733,294.237288 C395.719329,294.325655 422.744064,300 378.346285,266 C333.948507,232 369.856325,232 258.182733,232 C183.232787,232 0,292.390545 0,300 C80.4307579,296.099281 166.491669,294.178377 258.182733,294.237288 Z" id="Oval" fill="#E2D390"></path>
							<polygon id="Path-3-Copy" fill="#6B5B50" points="198 3 292.336 0 366.504 0 398 13.7931034 349.232 194.790042 167.368 211.494253 158 90 177 50"></polygon>
							<path d="M129.000554,179.883473 L121.057223,236.804036 C120.904558,237.898005 121.667636,238.908601 122.761604,239.061265 C122.853191,239.074046 122.945554,239.08046 123.038028,239.08046 L241,239.08046 C242.104569,239.08046 243,238.185029 243,237.08046 L243,138.664934 C243,138.33529 242.91852,138.010757 242.762808,137.720207 L218.841138,93.0836967 C218.31938,92.1101248 217.107175,91.7438574 216.133603,92.2656156 C215.952049,92.3629147 215.786615,92.4876767 215.643154,92.635488 L202.828041,105.839219 C202.419706,106.259937 201.84733,106.480295 201.262287,106.442016 L161.419155,103.835129 C161.331824,103.829415 161.244211,103.829439 161.156883,103.835202 L122.831408,106.364308 C121.729235,106.437041 120.89471,107.389489 120.967442,108.491662 C120.969508,108.52297 120.972311,108.554226 120.975848,108.585403 L129.007002,179.381615 C129.025935,179.548508 129.023768,179.717122 129.000554,179.883473 Z" id="Path-3-Copy" fill="#938071"></path>
							<path d="M216.873066,27.3962707 L213,70 L183.941121,92.2784738 C183.360873,92.7233303 183.069621,93.4493648 183.181564,94.1718973 L188.826816,130.608842 C188.934274,131.302426 189.397434,131.888926 190.047216,132.154235 L237.591728,151.566909 C238.104787,151.776394 238.681766,151.763609 239.185042,151.531604 L281.577731,131.989006 C281.948258,131.818197 282.362162,131.764796 282.763908,131.835969 L312.766204,137.151093 C313.049268,137.201239 313.339815,137.189775 313.618047,137.117482 L354.56009,126.479486 C355.173487,126.320107 355.675043,125.879431 355.912034,125.291645 L370.977433,87.9264228 C371.032139,87.7907399 371.101568,87.661469 371.184472,87.5409307 L385.741694,66.3755623 C385.911718,66.1283569 386.023945,65.8460656 386.070062,65.5495998 L392.672821,23.103294 C392.842601,22.0118507 392.095445,20.9894271 391.004002,20.8196471 C390.962977,20.8132654 390.921764,20.8081628 390.880422,20.8043466 L328.018032,15.0016645 C328.006011,15.0005548 327.99398,14.9995541 327.981941,14.9986623 L274.333412,11.0246972 C274.112669,11.0083458 273.890742,11.028752 273.676682,11.0850836 L218.355866,25.6431931 C217.541986,25.8573722 216.94926,26.5581369 216.873066,27.3962707 Z" id="Path-4" fill="#A49081"></path>
							<path d="M128.410548,258.37199 L108.344291,202.950899 C108.120938,202.33402 108.105962,201.660931 108.301656,201.034728 L123.096007,153.694121 C123.327334,152.953895 123.83633,152.332013 124.516221,151.958927 L169.001174,127.548099 C169.644638,127.195003 170.395221,127.09005 171.110856,127.253107 L248.377715,144.858214 C248.787981,144.951692 249.213323,144.957819 249.626111,144.876197 L261.002097,142.626789 C262.369178,142.356472 263.742402,143.063135 264.317069,144.332677 L283.733041,187.22604 C283.908989,187.614741 284,188.036501 284,188.46317 L284,229.878887 C284,230.830128 283.548867,231.725001 282.784124,232.290712 L237.108937,266.078492 C236.592533,266.460497 235.967153,266.666667 235.324812,266.666667 L166.639576,266.666667 C166.462941,266.666667 166.286652,266.651067 166.112762,266.620049 L130.704531,260.304049 C129.649713,260.115894 128.775319,259.379454 128.410548,258.37199 Z" id="Path-2" fill="#7C6C60"></path>
							<path d="M266.745969,78.3370539 L224.916148,111.278523 C224.349987,111.724381 224.067467,112.440347 224.176605,113.152678 L236.04487,190.615147 C236.212152,191.706976 237.232864,192.456469 238.324693,192.289187 C238.455124,192.269203 238.583258,192.23636 238.707221,192.191138 L336.863108,156.383682 C337.082746,156.303557 337.314732,156.262564 337.548528,156.262564 L379.142645,156.262564 C380.176822,156.262564 381.040439,155.474133 381.134377,154.444232 L387.983627,79.3517907 C388.051666,78.6058313 387.69717,77.8843851 387.065087,77.4824446 L358.49115,59.3123215 C358.170371,59.1083384 357.798101,59 357.417958,59 L320.350017,59 C320.118432,59 319.888607,59.0402213 319.670787,59.1188708 L267.304128,78.0271885 C267.102684,78.099925 266.914231,78.204546 266.745969,78.3370539 Z" id="Path-5" fill="#938071"></path>
							<path d="M220.83962,176.016885 L206.000186,270.105622 C205.828103,271.196705 206.5731,272.220703 207.664183,272.392785 C207.814637,272.416514 207.967309,272.422979 208.119231,272.412053 L272.027236,267.815942 C272.045214,267.814649 272.063174,267.813113 272.08111,267.811335 L396.272088,255.497387 C397.371267,255.3884 398.173977,254.408987 398.064989,253.309808 C398.05775,253.236802 398.0465,253.164249 398.031289,253.092479 L376.905933,153.415845 C376.902216,153.398306 376.898735,153.380717 376.89549,153.363085 L371.592683,124.542058 C371.392808,123.455723 370.350128,122.737106 369.263793,122.936982 C369.044408,122.977347 368.83332,123.054129 368.639272,123.164149 L346,136 L296.753086,130.09037 C296.267889,130.032147 295.778164,130.153579 295.376376,130.43174 L257.116863,156.919095 C257.039052,156.972964 256.957517,157.021242 256.87287,157.063565 L221.920772,174.539614 C221.34295,174.828525 220.940265,175.378749 220.83962,176.016885 Z" id="Path-3" fill="#6B5B50"></path>
						</g>
					</g>
					<g id="Crab" mask="url(#mask-2)">
						<g transform="translate(274.093150, 47.218117) rotate(-1.000000) translate(-274.093150, -47.218117) translate(175.093150, -16.281883)">
							<g id="Right-Legs" transform="translate(128.000000, 79.479963)">
								<g id="RIght-Leg-Copy" transform="translate(0.000000, 20.295131)">
									<path d="M19.3381435,11.3627984 C20.4090755,11.7339009 22.1047314,21.4469247 21.4800075,24.7224885 C21.4114989,25.0816942 20.7660528,25.0935911 20.0520982,24.351386 C19.3381435,23.609181 13.7680624,15.7935691 13.626506,13.2183109 C14.697438,11.7339009 18.2672114,10.9916959 19.3381435,11.3627984 Z" id="Path-6" stroke="#E03232" strokeWidth="3" fill="#F0504F" transform="translate(17.620482, 18.114704) rotate(-13.000000) translate(-17.620482, -18.114704) "></path>
									<path d="M10.5722892,14.9303751 C16.1984781,15.6908863 19.7349398,12.5469278 19.7349398,9.60679661 C19.7349398,6.66666542 15.8769816,4.02971443 10.5722892,4.79022564 C5.2675967,5.55073684 1.40963855,6.66666542 1.40963855,9.60679661 C1.40963855,12.5469278 4.94610019,14.1698638 10.5722892,14.9303751 Z" id="Oval-5-Copy" stroke="#E03232" strokeWidth="3" fill="#F0504F" transform="translate(10.572289, 9.851717) rotate(36.000000) translate(-10.572289, -9.851717) "></path>
									<path d="M15.9759036,14.7844224 C13.654146,13.609013 8.43019135,11.8458988 6.10843373,8.90737523 C7.26931254,13.0213083 13.0737066,15.9598318 15.9759036,14.7844224 Z" id="Gloss-Copy-2" fill="#F26E69"></path>
								</g>
								<g id="RIght-Leg-Copy-2" transform="translate(18.124151, 26.660397) rotate(-6.000000) translate(-18.124151, -26.660397) translate(6.124151, 13.660397)">
									<path d="M19.3381435,11.3627984 C20.4090755,11.7339009 22.1047314,21.4469247 21.4800075,24.7224885 C21.4114989,25.0816942 20.7660528,25.0935911 20.0520982,24.351386 C19.3381435,23.609181 13.7680624,15.7935691 13.626506,13.2183109 C14.697438,11.7339009 18.2672114,10.9916959 19.3381435,11.3627984 Z" id="Path-6" stroke="#E03232" strokeWidth="3" fill="#F0504F" transform="translate(17.620482, 18.114704) rotate(-13.000000) translate(-17.620482, -18.114704) "></path>
									<path d="M10.5722892,14.9303751 C16.1984781,15.6908863 19.7349398,12.5469278 19.7349398,9.60679661 C19.7349398,6.66666542 15.8769816,4.02971443 10.5722892,4.79022564 C5.2675967,5.55073684 1.40963855,6.66666542 1.40963855,9.60679661 C1.40963855,12.5469278 4.94610019,14.1698638 10.5722892,14.9303751 Z" id="Oval-5-Copy" stroke="#E03232" strokeWidth="3" fill="#F0504F" transform="translate(10.572289, 9.851717) rotate(36.000000) translate(-10.572289, -9.851717) "></path>
									<path d="M15.9759036,14.7844224 C13.654146,13.609013 8.43019135,11.8458988 6.10843373,8.90737523 C7.26931254,13.0213083 13.0737066,15.9598318 15.9759036,14.7844224 Z" id="Gloss-Copy-2" fill="#F26E69"></path>
								</g>
								<g id="RIght-Leg-Copy-3" transform="translate(23.787690, 17.158315) rotate(-20.000000) translate(-23.787690, -17.158315) translate(11.787690, 4.158315)">
									<path d="M19.3381435,11.3627984 C20.4090755,11.7339009 22.1047314,21.4469247 21.4800075,24.7224885 C21.4114989,25.0816942 20.7660528,25.0935911 20.0520982,24.351386 C19.3381435,23.609181 13.7680624,15.7935691 13.626506,13.2183109 C14.697438,11.7339009 18.2672114,10.9916959 19.3381435,11.3627984 Z" id="Path-6" stroke="#E03232" strokeWidth="3" fill="#F0504F" transform="translate(17.620482, 18.114704) rotate(-13.000000) translate(-17.620482, -18.114704) "></path>
									<path d="M10.5722892,14.9303751 C16.1984781,15.6908863 19.7349398,12.5469278 19.7349398,9.60679661 C19.7349398,6.66666542 15.8769816,4.02971443 10.5722892,4.79022564 C5.2675967,5.55073684 1.40963855,6.66666542 1.40963855,9.60679661 C1.40963855,12.5469278 4.94610019,14.1698638 10.5722892,14.9303751 Z" id="Oval-5-Copy" stroke="#E03232" strokeWidth="3" fill="#F0504F" transform="translate(10.572289, 9.851717) rotate(36.000000) translate(-10.572289, -9.851717) "></path>
									<path d="M15.9759036,14.7844224 C13.654146,13.609013 8.43019135,11.8458988 6.10843373,8.90737523 C7.26931254,13.0213083 13.0737066,15.9598318 15.9759036,14.7844224 Z" id="Gloss-Copy-2" fill="#F26E69"></path>
								</g>
							</g>
							<g id="Right-Legs-Copy" transform="translate(51.000000, 102.979963) scale(-1, 1) translate(-51.000000, -102.979963) translate(31.000000, 79.479963)">
								<g id="RIght-Leg-Copy" transform="translate(-0.000000, 20.295131)">
									<path d="M19.3381435,11.3627984 C20.4090755,11.7339009 22.1047314,21.4469247 21.4800075,24.7224885 C21.4114989,25.0816942 20.7660528,25.0935911 20.0520982,24.351386 C19.3381435,23.609181 13.7680624,15.7935691 13.626506,13.2183109 C14.697438,11.7339009 18.2672114,10.9916959 19.3381435,11.3627984 Z" id="Path-6" stroke="#E03232" strokeWidth="3" fill="#F0504F" transform="translate(17.620482, 18.114704) rotate(-13.000000) translate(-17.620482, -18.114704) "></path>
									<path d="M10.5722892,14.9303751 C16.1984781,15.6908863 19.7349398,12.5469278 19.7349398,9.60679661 C19.7349398,6.66666542 15.8769816,4.02971443 10.5722892,4.79022564 C5.2675967,5.55073684 1.40963855,6.66666542 1.40963855,9.60679661 C1.40963855,12.5469278 4.94610019,14.1698638 10.5722892,14.9303751 Z" id="Oval-5-Copy" stroke="#E03232" strokeWidth="3" fill="#F0504F" transform="translate(10.572289, 9.851717) rotate(36.000000) translate(-10.572289, -9.851717) "></path>
									<path d="M15.9759036,14.7844224 C13.654146,13.609013 8.43019135,11.8458988 6.10843373,8.90737523 C7.26931254,13.0213083 13.0737066,15.9598318 15.9759036,14.7844224 Z" id="Gloss-Copy-2" fill="#F26E69"></path>
								</g>
								<g id="RIght-Leg-Copy-2" transform="translate(18.124151, 26.660397) rotate(-6.000000) translate(-18.124151, -26.660397) translate(6.124151, 13.660397)">
									<path d="M19.3381435,11.3627984 C20.4090755,11.7339009 22.1047314,21.4469247 21.4800075,24.7224885 C21.4114989,25.0816942 20.7660528,25.0935911 20.0520982,24.351386 C19.3381435,23.609181 13.7680624,15.7935691 13.626506,13.2183109 C14.697438,11.7339009 18.2672114,10.9916959 19.3381435,11.3627984 Z" id="Path-6" stroke="#E03232" strokeWidth="3" fill="#F0504F" transform="translate(17.620482, 18.114704) rotate(-13.000000) translate(-17.620482, -18.114704) "></path>
									<path d="M10.5722892,14.9303751 C16.1984781,15.6908863 19.7349398,12.5469278 19.7349398,9.60679661 C19.7349398,6.66666542 15.8769816,4.02971443 10.5722892,4.79022564 C5.2675967,5.55073684 1.40963855,6.66666542 1.40963855,9.60679661 C1.40963855,12.5469278 4.94610019,14.1698638 10.5722892,14.9303751 Z" id="Oval-5-Copy" stroke="#E03232" strokeWidth="3" fill="#F0504F" transform="translate(10.572289, 9.851717) rotate(36.000000) translate(-10.572289, -9.851717) "></path>
									<path d="M15.9759036,14.7844224 C13.654146,13.609013 8.43019135,11.8458988 6.10843373,8.90737523 C7.26931254,13.0213083 13.0737066,15.9598318 15.9759036,14.7844224 Z" id="Gloss-Copy-2" fill="#F26E69"></path>
								</g>
								<g id="RIght-Leg-Copy-3" transform="translate(23.787690, 17.158315) rotate(-20.000000) translate(-23.787690, -17.158315) translate(11.787690, 4.158315)">
									<path d="M19.3381435,11.3627984 C20.4090755,11.7339009 22.1047314,21.4469247 21.4800075,24.7224885 C21.4114989,25.0816942 20.7660528,25.0935911 20.0520982,24.351386 C19.3381435,23.609181 13.7680624,15.7935691 13.626506,13.2183109 C14.697438,11.7339009 18.2672114,10.9916959 19.3381435,11.3627984 Z" id="Path-6" stroke="#E03232" strokeWidth="3" fill="#F0504F" transform="translate(17.620482, 18.114704) rotate(-13.000000) translate(-17.620482, -18.114704) "></path>
									<path d="M10.5722892,14.9303751 C16.1984781,15.6908863 19.7349398,12.5469278 19.7349398,9.60679661 C19.7349398,6.66666542 15.8769816,4.02971443 10.5722892,4.79022564 C5.2675967,5.55073684 1.40963855,6.66666542 1.40963855,9.60679661 C1.40963855,12.5469278 4.94610019,14.1698638 10.5722892,14.9303751 Z" id="Oval-5-Copy" stroke="#E03232" strokeWidth="3" fill="#F0504F" transform="translate(10.572289, 9.851717) rotate(36.000000) translate(-10.572289, -9.851717) "></path>
									<path d="M15.9759036,14.7844224 C13.654146,13.609013 8.43019135,11.8458988 6.10843373,8.90737523 C7.26931254,13.0213083 13.0737066,15.9598318 15.9759036,14.7844224 Z" id="Gloss-Copy-2" fill="#F26E69"></path>
								</g>
							</g>
							<g id="Right-Arm" transform="translate(153.246695, 45.324732) rotate(-38.000000) translate(-153.246695, -45.324732) translate(120.246695, 15.324732)">
								<path d="M30.1974023,50.5323529 C37.1150963,51.6251421 41.4633612,47.107544 41.4633612,42.8828281 C41.4633612,38.6581122 36.7197995,34.8690403 30.1974023,35.9618295 C23.6750051,37.0546188 18.9314435,38.6581122 18.9314435,42.8828281 C18.9314435,47.107544 23.2797083,49.4395636 30.1974023,50.5323529 Z" id="Oval-5" stroke="#E03232" strokeWidth="3" fill="#F0504F" transform="translate(30.197402, 43.234757) rotate(316.000000) translate(-30.197402, -43.234757) "></path>
								<path d="M19.0462783,56.6304176 C25.0836052,57.5690245 28.8784963,53.6888173 28.8784963,50.0601693 C28.8784963,46.4315214 24.7386151,43.1770521 19.0462783,44.115659 C13.3539416,45.0542659 9.21406034,46.4315214 9.21406034,50.0601693 C9.21406034,53.6888173 13.0089515,55.6918107 19.0462783,56.6304176 Z" id="Oval-5" stroke="#E03232" strokeWidth="3" fill="#F0504F" transform="translate(19.046278, 50.362445) rotate(-18.000000) translate(-19.046278, -50.362445) "></path>
								<path d="M8.47826087,56.3804129 C13.6842105,57.1808824 16.9565217,53.8717361 16.9565217,50.7771266 C16.9565217,47.682517 13.3867277,44.9070171 8.47826087,45.7074866 C3.56979405,46.507956 9.09494702e-13,47.682517 9.09494702e-13,50.7771266 C9.09494702e-13,53.8717361 3.27231121,55.5799434 8.47826087,56.3804129 Z" id="Oval-5" stroke="#E03232" strokeWidth="3" fill="#F0504F"></path>
								<g id="Group-9" transform="translate(14.225515, 0.000000)">
									<mask id="mask-4" fill="white">
										<use xlinkHref="#path-3"></use>
									</mask>
									<use id="Oval-6" stroke="#E03232" strokeWidth="3" fill="#F0504F" transform="translate(25.592008, 24.047235) rotate(26.000000) translate(-25.592008, -24.047235) " xlinkHref="#path-3"></use>
								</g>
								<path d="M41.9267334,38.7889373 C28.553094,33.6726851 27.0454234,24.038298 27.2776657,12.1563243 C21.4779561,19.64828 26.8943601,36.5875375 41.9267334,38.7889373 Z" id="Gloss-Copy" fill="#F26E69"></path>
							</g>
							<g id="Left-Arm" transform="translate(44.753305, 44.241255) scale(-1, 1) rotate(-38.000000) translate(-44.753305, -44.241255) translate(11.753305, 14.241255)">
								<path d="M30.1974023,50.5323529 C37.1150963,51.6251421 41.4633612,47.107544 41.4633612,42.8828281 C41.4633612,38.6581122 36.7197995,34.8690403 30.1974023,35.9618295 C23.6750051,37.0546188 18.9314435,38.6581122 18.9314435,42.8828281 C18.9314435,47.107544 23.2797083,49.4395636 30.1974023,50.5323529 Z" id="Oval-5" stroke="#E03232" strokeWidth="3" fill="#F0504F" transform="translate(30.197402, 43.234757) rotate(316.000000) translate(-30.197402, -43.234757) "></path>
								<path d="M19.0462783,56.6304176 C25.0836052,57.5690245 28.8784963,53.6888173 28.8784963,50.0601693 C28.8784963,46.4315214 24.7386151,43.1770521 19.0462783,44.115659 C13.3539416,45.0542659 9.21406034,46.4315214 9.21406034,50.0601693 C9.21406034,53.6888173 13.0089515,55.6918107 19.0462783,56.6304176 Z" id="Oval-5" stroke="#E03232" strokeWidth="3" fill="#F0504F" transform="translate(19.046278, 50.362445) rotate(-18.000000) translate(-19.046278, -50.362445) "></path>
								<path d="M8.47826087,56.3804129 C13.6842105,57.1808824 16.9565217,53.8717361 16.9565217,50.7771266 C16.9565217,47.682517 13.3867277,44.9070171 8.47826087,45.7074866 C3.56979405,46.507956 -9.09494702e-13,47.682517 -9.09494702e-13,50.7771266 C-9.09494702e-13,53.8717361 3.27231121,55.5799434 8.47826087,56.3804129 Z" id="Oval-5" stroke="#E03232" strokeWidth="3" fill="#F0504F"></path>
								<g id="Group-9" transform="translate(14.225515, -0.000000)">
									<mask id="mask-6" fill="white">
										<use xlinkHref="#path-5"></use>
									</mask>
									<use id="Oval-6" stroke="#E03232" strokeWidth="3" fill="#F0504F" transform="translate(25.592008, 24.047235) rotate(26.000000) translate(-25.592008, -24.047235) " xlinkHref="#path-5"></use>
								</g>
								<path d="M40.9267334,38.7889373 C28.3431838,34.2971081 26.9245836,25.8385686 27.1431054,15.4067535 C21.6860319,21.9843389 26.7824449,36.8562116 40.9267334,38.7889373 Z" id="Gloss-Copy" fill="#F26E69"></path>
							</g>
							<g id="Face" transform="translate(52.000000, 44.117932)">
								<path d="M42.4444854,14.2467801 C43.9435304,14.1587452 45.463151,14.1137058 47,14.1137058 C47.0971065,14.1137058 47.1941443,14.1138857 47.2911124,14.1142448 C47.2547548,13.7266931 47.2361809,13.3342129 47.2361809,12.9375637 C47.2361809,5.79234456 53.2634631,0 60.6984925,0 C68.1335218,0 74.160804,5.79234456 74.160804,12.9375637 C74.160804,15.0416276 73.6381573,17.0283789 72.710822,18.7844574 C85.5309705,23.9094691 94,32.7566307 94,42.8115744 C94,58.6609695 72.9573832,71.5094429 47,71.5094429 C21.0426168,71.5094429 0,58.6609695 0,42.8115744 C0,33.6592037 7.01683986,25.5075159 17.9449647,20.252741 C16.4580821,18.1720043 15.5879397,15.6524394 15.5879397,12.9375637 C15.5879397,5.79234456 21.6152219,0 29.0502513,0 C36.4852806,0 42.5125628,5.79234456 42.5125628,12.9375637 C42.5125628,13.3794946 42.489506,13.8162502 42.4444854,14.2467801 Z" stroke="#E03232" strokeWidth="4" fill="#F0504F"></path>
								<path d="M25.0351759,64.9230469 C20.3115578,60.2184783 9.44723618,51.7502548 2.83417085,44.222945 C4.25125628,52.6911685 18.8944724,62.5707626 25.0351759,64.9230469 Z" id="Gloss" fill="#F26E69"></path>
								<path d="M68.4924623,38.1070058 C57.6281407,43.7524881 32.120603,50.809341 20.7839196,38.1070058 C25.5144335,59.2808545 64.77563,60.4571794 68.4924623,38.1070058 Z" id="Mouth" fill="#565757"></path>
								<g id="Left-Eye" transform="translate(18.422111, 2.352284)">
									<g id="Group-7">
										<mask id="mask-8" fill="white">
											<use xlinkHref="#path-7"></use>
										</mask>
										<use id="Oval-3" fill="#D8EEEE" xlinkHref="#path-7"></use>
										<ellipse id="Oval-3-Copy-2" fill="#FFFFFF" mask="url(#mask-8)" cx="13.6984925" cy="10.350051" rx="10.3919598" ry="10.350051"></ellipse>
									</g>
									<path d="M13.2376315,2.92930794 C12.9313647,3.44158715 12.7537688,4.05083271 12.7537688,4.70456861 C12.7537688,6.52335166 14.1284122,7.99776664 15.8241206,7.99776664 C16.7835354,7.99776664 17.6401714,7.52577948 18.2032048,6.78647891 C18.6459777,7.72047929 18.8944724,8.77013757 18.8944724,9.87959409 C18.8944724,13.7769863 15.8279604,16.936447 12.0452261,16.936447 C8.26249189,16.936447 5.1959799,13.7769863 5.1959799,9.87959409 C5.1959799,5.98220184 8.26249189,2.82274117 12.0452261,2.82274117 C12.4519484,2.82274117 12.8503907,2.85926676 13.2376315,2.92930794 Z M9.44723618,8.46822351 C10.2298709,8.46822351 10.8643216,7.73101602 10.8643216,6.82162449 C10.8643216,5.91223297 10.2298709,5.17502548 9.44723618,5.17502548 C8.66460151,5.17502548 8.03015075,5.91223297 8.03015075,6.82162449 C8.03015075,7.73101602 8.66460151,8.46822351 9.44723618,8.46822351 Z" id="Oval-4" fill="#565757"></path>
								</g>
								<g id="Right-Eye" transform="translate(50.542714, 2.352284)">
									<g id="Group-8">
										<mask id="mask-10" fill="white">
											<use xlinkHref="#path-9"></use>
										</mask>
										<use id="Oval-3-Copy" fill="#D8EEEE" xlinkHref="#path-9"></use>
										<ellipse id="Oval-3-Copy-3" fill="#FFFFFF" mask="url(#mask-10)" cx="13.6984925" cy="10.350051" rx="10.3919598" ry="10.350051"></ellipse>
									</g>
									<path d="M13.7099933,3.39976481 C13.4037265,3.91204401 13.2261307,4.52128957 13.2261307,5.17502548 C13.2261307,6.99380853 14.600774,8.46822351 16.2964824,8.46822351 C17.2558972,8.46822351 18.1125332,7.99623634 18.6755666,7.25693577 C19.1183395,8.19093615 19.3668342,9.24059443 19.3668342,10.350051 C19.3668342,14.2474432 16.3003222,17.4069039 12.5175879,17.4069039 C8.7348537,17.4069039 5.66834171,14.2474432 5.66834171,10.350051 C5.66834171,6.4526587 8.7348537,3.29319803 12.5175879,3.29319803 C12.9243102,3.29319803 13.3227525,3.32972362 13.7099933,3.39976481 Z M9.91959799,8.93868037 C10.7022327,8.93868037 11.3366834,8.20147288 11.3366834,7.29208135 C11.3366834,6.38268983 10.7022327,5.64548234 9.91959799,5.64548234 C9.13696332,5.64548234 8.50251256,6.38268983 8.50251256,7.29208135 C8.50251256,8.20147288 9.13696332,8.93868037 9.91959799,8.93868037 Z" id="Oval-4-Copy" fill="#565757"></path>
								</g>
							</g>
						</g>
					</g>
				</g>
			</g>
		</svg>


	private static arrow_up_svg =
		<svg className="arrow arrow-up" version="1.1" xmlns="http://www.w3.org/2000/svg" width="44" height="30" viewBox="0 0 44 30">
			<path d="M42.050 29.917h-40.32c-0.933 0-1.69-0.757-1.69-1.69 0-0.373 0.123-0.735 0.351-1.031l20.13-26.151c0.569-0.74 1.631-0.878 2.37-0.308 0.115 0.089 0.218 0.192 0.307 0.306l20.19 26.151c0.57 0.739 0.434 1.8-0.305 2.371-0.296 0.228-0.659 0.352-1.033 0.352z"></path>
		</svg>

	private static arrow_down_svg =
		<svg className="arrow arrow-down" version="1.1" xmlns="http://www.w3.org/2000/svg" width="45" height="30" viewBox="0 0 45 30">
			<path d="M1.298 0h42.038c0.7 0 1.268 0.568 1.268 1.268 0 0.28-0.093 0.552-0.263 0.773l-20.988 27.265c-0.427 0.555-1.223 0.658-1.778 0.231-0.086-0.066-0.164-0.144-0.23-0.23l-21.050-27.265c-0.428-0.554-0.325-1.35 0.229-1.778 0.222-0.171 0.494-0.264 0.775-0.264z"></path>
		</svg>

	render() {

		const data = this.props.waterLevel;
		if (!data || data.errors) {
			return <div>TODO</div>;
		}

		const isRising = data.currentIsRising;
		const high = isRising ? data.next : data.previous;
		const low = isRising ? data.previous : data.next;

		const currentVal = data.current.val;
		const highVal = high.val;
		const lowVal = low.val;
		let percentFallen = .8; //1 - ((currentVal - lowVal) / (highVal - lowVal));
		console.log(percentFallen, currentVal, highVal, lowVal);

		const upperWavePercent = percentFallen;
		const lowerWavePercent = percentFallen;

		const upperLine = Math.max(Math.round(percentFallen * 100), 10);
		const upperLineStyle: React.CSSProperties = {
			flex: upperLine
		};
		const lowerLine = 100 - upperLine;
		const lowerLineStyle: React.CSSProperties = {
			flex: lowerLine
		};

		return (
			<div className="waves">
				<div className="main">
					<div className="wave-container">
						<SVGWave animationOpts={{ percentFallen: upperWavePercent, percentMin: .1, percentRange: .7, colorClass: "wave-higher", duration: 7.5 }} />
					</div>
					{Wave.rock_svg}
					<div className="wave-container">
						<SVGWave animationOpts={{ percentFallen: lowerWavePercent, percentMin: .2, percentRange: .7, colorClass: "wave-lower", duration: 6 }} />
					</div>
					<div className="marker">
						<div className="line-container">
							<div className={`line ${isRising ? "line-faint" : ""}`} style={upperLineStyle} ></div>
							<div className="line-arrow-holder">
								{isRising ? Wave.arrow_up_svg : Wave.arrow_down_svg}
							</div>
							<div className={`line ${isRising ? "" : "line-faint"}`} style={lowerLineStyle} ></div>
						</div>
						<span className="marker-header marker-high">
							<span className="marker-title">High</span>
							<span className="marker-value">({roundVal(highVal)} ft)</span>
						</span>
						<span className="marker-header marker-low">
							<span className="marker-title">Low</span>
							<span className="marker-value">({roundVal(lowVal)} ft)</span>
						</span>
					</div>
				</div>
				<div className="gradient-out"></div>
			</div>
		);
	}
}

function roundVal(num: number): number {
	return Math.round(num * 100) / 100;
}

interface SVGWaveAnimationOpts {
	percentFallen: number,
	percentMin: number,
	percentRange: number,
	colorClass: string,
	duration: number,
}

interface SVGWaveProps {
	animationOpts: SVGWaveAnimationOpts
}

export class SVGWave extends React.Component<SVGWaveProps> {

	static getPath(topDistanceOutOf1, ampOutOf1, periodOutOf1, controlPointOutOf1, viewBoxX, viewBoxY, timePassed): string {
		const y = topDistanceOutOf1 * viewBoxY;
		const r = ampOutOf1 * viewBoxY;
		const p = viewBoxX / 2; // half of the period; one bezier distance

		// Control Point of 1 means the distance between the two points of the bezier curve
		const cp1 = p * controlPointOutOf1;
		const cp2 = p - (p * controlPointOutOf1);

		console.log({ y, r, p, cp1, cp2 });

		const singleWaveBezier = `c ${cp1} -${r}, ${cp2} -${r}, ${p} 0, c${cp1} ${r}, ${cp2} ${r}, ${p} 0`;
		/*
			One wave:
			     ____
			    /    \
			(A)/      \       /
			           \     /
						-----
			Where (A) is the top distance 
		*/

		// Make 2 waves (first of which covers the whole viewbox - second of which is completely offscreen) so we are 2X the viewbox width
		return `M0 ${y}, ${singleWaveBezier} ${singleWaveBezier} v${viewBoxY - y} h-${viewBoxX * 2} v-${viewBoxY - y} z`
		// M0,${p} c13,0 20.3,-${r} 33.3,-${r} c13,0 20.3,${r} 33.3,${r} c13,0 20.3,-${r} 33.3,-${r} v100 h-100 v-${100 - p} z
	}

	render() {

		const opts = this.props.animationOpts;

		// Should be between 0 and 1 inclusive
		const p = Math.min(Math.max(opts.percentFallen, 0), 1);
		// Transform to between .3 and .9, inclusive, steps by .1
		const min = opts.percentMin;
		const range = opts.percentRange;
		const transformedP = Math.floor(((p * range) + min) * 100) / 100;
		console.log(transformedP);

		// Get the path
		const path = SVGWave.getPath(transformedP, .05, 1.5, .3, 100, 100, 0);
		console.log(path);

		const name = `wave_${opts.colorClass}`;
		return (
			<svg className={`wave ${opts.colorClass}`} version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">
				<defs>
					<path id={name} d={path}>
					</path>
				</defs>
				<use xlinkHref={`#${name}`} x="0" y="0">
					<animate attributeName="x" from="-100" to="0" dur={`${opts.duration}s`}
						repeatCount="indefinite" />
				</use>
			</svg>
		);
	}
}