import { DateTime } from 'luxon';
import * as React from 'react';
import { PanelPadding } from '@/core/layout/panel/panel';
import { OutLink } from '@/core/link';
import { Note } from '@/core/note';
import { Heading, Paragraph } from '@/core/text';
import { Block } from '@/core/theme/box';
import { DEFINE } from '@/services/define';
import { AboutIconLargeNamed } from './about-icon';
import { AboutShare } from './about-share';

export const About: React.FC = () => {

	return (
		<PanelPadding>
			<AboutIconLargeNamed />
			<Block.Elf24 />
			<AboutShare />
			<Block.Elf24 />
			<div>
				<Heading>About</Heading>
				<Paragraph>
					This project is a labor of love designed for use by residents and visitors to Wells, Maine.
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
				</Paragraph>
				<Block.Bat08 />
				<Note>
					Please do your part to keep Wells a clean and beautiful place.
					Properly dispose of all waste and ensure trash cannot be blown or washed into the marsh or ocean.
					Reduce your consumption of single-use, non-recyclable, and non-compostable materials.
					Do not walk on the marsh or otherwise disturb the ecosystem.
					Thank you!
				</Note>
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
					To report a bug, send thanks, request a feature, or see how this product is made, <OutLink title='Wells Beach Time on GitHub' href="https://github.com/messman/tidy">visit the project on GitHub</OutLink>.
				</Paragraph>
			</div>
		</PanelPadding>
	);
};
