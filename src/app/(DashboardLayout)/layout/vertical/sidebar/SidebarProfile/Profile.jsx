import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useSelector } from 'react-redux';
import { IconPower } from '@tabler/icons-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export const Profile = () => {
  const customizer = useSelector((state) => state.customizer);
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const hideMenu = lgUp ? customizer.isCollapse && !customizer.isSidebarHover : '';
  const [adminName, setAdminName] = useState('');
  const router = useRouter();
  useEffect(() => {
    // Check for admin credentials
    const storedUsername = localStorage.getItem('adminUsername');
    const storedAdminId = localStorage.getItem('adminId');
    
    if (!storedUsername || !storedAdminId) {
      // Redirect to login page if credentials are missing
      router.push('/auth/auth1/login');
    } else {
      setAdminName(storedUsername);
    }
  }, [router,]);
  const handleSignOut = () => {
    // Clear the admin's session data from localStorage
    localStorage.removeItem('adminSessionToken');
    localStorage.removeItem('adminId');
    localStorage.removeItem('adminUsername');
    
    // Redirect to the login page
    router.push('/auth/auth1/login');
  };
  // If there's no admin name, don't render the component
  if (!adminName) {
    return null;
  }
  return (
    <Box
      display={'flex'}
      alignItems="center"
      gap={2}
      sx={{ m: 3, p: 2, bgcolor: `bg-gray-800` }}
    >
      {!hideMenu ? (
        <>
          <Avatar alt="Remy Sharp" src={"/images/profile/user-1.jpg"} sx={{height: 40, width: 40}} />

          <Box>
            <Typography variant="h6">{adminName}</Typography>
            <Typography variant="caption">admin</Typography>
          </Box>
          <Box sx={{ ml: 'auto' }}>
            <Tooltip title="Logout" placement="top">
              <IconButton
              onClick={handleSignOut}
                color="primary"
                component={Link}
                href="/auth/auth1/login"
                aria-label="logout"
                size="small"
              >
                <IconPower size="20" />
              </IconButton>
            </Tooltip>
          </Box>
        </>
      ) : (
        ''
      )}
    </Box>
  );
};
