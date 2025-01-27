import { useSelector } from 'react-redux';
import Link from "next/link";
import { styled } from "@mui/material/styles";
import Image from "next/image";
import Box from "@mui/material/Box";

const Logo = () => {
  const customizer = useSelector((state) => state.customizer);
  const LinkStyled = styled(Link)(() => ({
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
  }));

  return (
    <LinkStyled href="/">
      <Box sx={{ display: 'flex', alignItems: 'center', height: customizer.TopbarHeight }}>
        <Image
          src={customizer.activeMode === "dark" ? "/images/logos/light-logo.svg" : "/images/logos/dark-logo.svg"}
          alt="logo"
          height={customizer.TopbarHeight}
          width={20}
          style={{ width: 'auto', height: '100%', maxHeight: '40px' }}
          priority
        />
      </Box>
    </LinkStyled>
  );
};

export default Logo;