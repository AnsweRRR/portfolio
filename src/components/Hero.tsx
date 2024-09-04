import { Box, styled } from "@mui/material";
import ComputersCanvas from "./canvas/Computer";

const HeroSection = styled(Box)(() => ({
	position: 'relative',
	width: '100%',
	height: '100vh',
	marginLeft: 'auto',
	marginRight: 'auto'
})) as typeof Box;

const CanvasContainer = styled(Box)(({ theme }) => ({
	position: 'absolute',
	top: '120px',
	right: 0,
	bottom: 0,
	left: 0,
	maxWidth: '80rem',
	marginLeft: 'auto',
	marginRight: 'auto',
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'flex-start',
	gap: '1.25rem',
	paddingLeft: '1.5rem',
	paddingRight: '1.5rem',
	[theme.breakpoints.up('sm')]: {
		paddingLeft: '4rem',
		paddingRight: '4rem',
	},
})) as typeof Box;

const Hero: React.FC = () => {
	return (
		<HeroSection component="section">
			<CanvasContainer>
				<ComputersCanvas />
			</CanvasContainer>
		</HeroSection>
	);
}

export default Hero;