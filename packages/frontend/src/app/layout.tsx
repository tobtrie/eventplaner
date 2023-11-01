import * as React from 'react';
import ThemeRegistry from '@/components/ThemeRegistry/ThemeRegistry';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

export const metadata = {
  title: 'Eventplaner',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <Stack direction="column" gap={2} padding={2}>
            <Typography variant="h3">Eventplanner</Typography>
            {children}
          </Stack>
        </ThemeRegistry>
      </body>
    </html>
  );
}
