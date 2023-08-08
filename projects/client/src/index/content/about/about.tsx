import { DateTime } from 'luxon';
import * as React from 'react';
import { Block } from '@/index/core/layout/layout-shared';
import { OutLink } from '@/index/core/text/text-link';
import { FontDoc } from '@/index/core/text/text-shared';
import { DEFINE } from '@/index/define';
import { AboutIconLargeNamed } from './about-icon';
import { AboutShare } from './about-share';

export const About: React.FC = () => {

	const Heading = FontDoc.C_Topic.Component;
	const Paragraph = FontDoc.E_Paragraph.Component;

	return (
		<>
			<AboutIconLargeNamed />
			<Block.Elf24 />
			<AboutShare />
			<Block.Elf24 />
			<div>
				<Heading>About</Heading>
				<Paragraph>
					This project is a labor of love designed for use by residents of and visitors to Wells, Maine.
					This project is dedicated to Mark Messier and Dawna Messier; the project (and its developer) would not exist without them.
				</Paragraph>
				<Paragraph>
					This project uses data from NOAA (United States National Oceanic and Atmospheric Administration) and OpenWeather.
					Apparent sunrise and apparent sunset are calculated from <OutLink title='NOAA solar calculations' href="https://gml.noaa.gov/grad/solcalc/">formulas from NOAA</OutLink>.
					This data is not guaranteed accurate, nor should it be relied upon for activities that require accurate data for safety; use it at your own risk.
					Most data is prediction, not measurement.
				</Paragraph>
				<Paragraph>
					Live measurement of water level comes from <OutLink title='NOAA station homepage' href="https://tidesandcurrents.noaa.gov/stationhome.html?id=8419317">NOAA station 8419317</OutLink> located
					on the Wells Town Dock on Harbor Road.
					When that station is unavailable, measurements come from <OutLink title='NOAA station homepage' href="https://tidesandcurrents.noaa.gov/stationhome.html?id=8418150">NOAA station 8418150</OutLink> located
					in Portland.
				</Paragraph>
				<Block.Bat08 />
				Please do your part to keep Wells a clean and beautiful place.
				Properly dispose of all waste and ensure trash cannot be blown or washed into the marsh or ocean.
				Reduce your consumption of single-use, non-recyclable, and non-compostable materials.
				Do not walk on the marsh or otherwise disturb the ecosystem.
				Thank you!
			</div>
			<Block.Elf24 />
			<div>
				<Heading>Development</Heading>
				<Paragraph>
					Copyright &copy; Andrew Messier.
				</Paragraph>
				<Paragraph>
					Version: {DEFINE.buildVersion} ({DateTime.fromMillis(DEFINE.buildTime).toLocaleString()})
				</Paragraph>
				<Paragraph>
					Credit to NOAA &amp; OpenWeather.
				</Paragraph>
				<Paragraph>
					To report a bug, send thanks, request a feature, or see how this application works, <OutLink title='Wells Beach Time on GitHub' href="https://github.com/messman/tidy">visit the project on GitHub</OutLink>.
				</Paragraph>
			</div>
		</>
	);
};

