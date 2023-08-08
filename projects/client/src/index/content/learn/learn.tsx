import * as React from 'react';
import { Block } from '@/index/core/layout/layout-shared';
import { OutLink } from '@/index/core/text/text-link';
import { FontDoc } from '@/index/core/text/text-shared';

export const Education: React.FC = () => {

	const Heading = FontDoc.C_Topic.Component;
	const Paragraph = FontDoc.E_Paragraph.Component;

	return (
		<>
			<div>
				<Heading>What causes the tides?</Heading>
				<Paragraph>
					The primary source of the tides is the moon's gravitational pull. The power of this gravitational pull affects areas differently as the Earth rotates.
				</Paragraph>
				<Paragraph>
					As the moon and Earth move, the moon's gravitational pull causes Earth and its oceans to bulge out directly
					toward the moon and directly away from the moon. These two bulges are the high tides,
					and areas far from these bulges will be the low tides.
				</Paragraph>
				<Paragraph>
					The strength and timing of tides are also controlled by the sun's gravitational pull, the moon's orbit around Earth, Earth's tilt,
					weather, geography, and more. These many factors can make tidal predictions complicated.
				</Paragraph>
			</div>
			<Block.Dog16 />
			<div>
				<Heading>How often do tides occur?</Heading>
				<Paragraph>
					Since the moon's position and pull is largely responsible for the tides, the time the moon takes to move through the sky is important to know in predicting tides.
					It takes about 24 hours and 50 minutes for the moon to return to the same meridian (longitude line) in the sky as Earth rotates (also known as the moon's "apparent orbit" from Earth).
				</Paragraph>
				<Paragraph>
					During this "tidal day", many coastal locations on earth such as Wells will experience two high tides and two low tides &mdash;
					two times where the ocean around Wells bulges toward or away from the moon, and two times where water flows away.
					The time between two high tides and the time between two low tides should be half a tidal day: roughly 12 hours and 25 minutes.
				</Paragraph>
				<Paragraph>
					This timing, however, is not exact. As discussed before, many other factors can influence the tides. These factors can change both the height and timing of high and low tides.
				</Paragraph>
				<Paragraph>
					Earth's geography can even cause some coastal locations to regularly experience fewer than two tides a day or to experience irregular high and low tide times.
				</Paragraph>
			</div>
			<Block.Dog16 />
			<div>
				<Heading>Why are high or low tides not always the same height across a day, month, or year?</Heading>
				<Paragraph>
					The relationship between the moon's position, the sun's position, and a location on Earth plays a huge role in how the height of a high tide or low tide changes over time.
					The sun affects the tides just like the moon, but only with about half the power.
				</Paragraph>
				<Paragraph>
					When the sun and moon align relative to Earth (at a full moon or new moon), their tidal bulges will add together.
					This added power will create higher high tides and lower low tides. When the sun and moon do not align with Earth, tidal effects are more muted.
				</Paragraph>
				<Paragraph>
					Even the elliptic shape of Earth's orbit around the sun and the moon's orbit around Earth can cause tidal differences.
					In January, the Earth is physically closer to the sun (perihelion) and experiences more of the sun's gravitational power;
					similarly, once a month, the moon is closer to the Earth than it is any other time (perigee).
					A "king tide" (not a scientific term) can occur when the Earth is physically closer to both the sun and the moon
					at the same time and also experiencing a full or new moon. These king tides typically cause the largest tidal range of the year.
				</Paragraph>
				<Paragraph>
					Of course, weather can modify the final effect of these astronomical events.
				</Paragraph>
			</div>
			<Block.Dog16 />
			<div>
				<Heading>How are tides measured and made available?</Heading>
				<Paragraph>
					NOAA (National Oceanic and Atmospheric Administration) is responsible for the recording and sharing of both weather and tidal data in the United States.
				</Paragraph>
				<Paragraph>
					NOAA uses data recording stations to collect measurements and send them to servers for processing. A NOAA data recording station is set up at the town pier.
				</Paragraph>
				<Paragraph>
					Many weather apps and services rely on the data NOAA provides.
				</Paragraph>
			</div>
			<Block.Dog16 />
			<div>
				<Heading>Where can I learn more?</Heading>
				<Paragraph>
					To learn more, check
					out <OutLink title='NOAA Tides Education' href="https://oceanservice.noaa.gov/education/tutorial_tides/welcome.html">NOAA's excellent resources on how tides work</OutLink>.
				</Paragraph>
				<Paragraph>
					To learn about the data recording station for Wells (including what data it records), see
					the <OutLink title='Wells Data Recording Station' href="https://tidesandcurrents.noaa.gov/stationhome.html?id=8419317">Wells NOAA station homepage</OutLink>.
					You can also refer to the <OutLink title='Portland Data Recording Station' href="https://tidesandcurrents.noaa.gov/stationhome.html?id=8418150">Portland NOAA station homepage</OutLink>.
				</Paragraph>
			</div>
		</>
	);
};