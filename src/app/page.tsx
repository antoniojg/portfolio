'use client'

import { useRef, useState } from 'react';
import {
  Box,
  Grid,
  Button,
  Text,
  Image,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogCloseTrigger,
  DialogBody,
  DialogFooter,
  useDisclosure,
  CloseButton,
  VStack,
  Portal,
} from '@chakra-ui/react';
import Draggable from 'react-draggable';

type DraggableIconProps = {
  project: string;
  onDoubleClick: (project: string) => void;
  position: { x: number; y: number };
  onDrag: (project: string, newPos: { x: number; y: number }) => void;
  onStop: (project: string, newPos: { x: number; y: number }) => void;
}

function DraggableIcon({
  project,
  onDoubleClick,
  position,
  onDrag,
  onStop,
}: DraggableIconProps) {
  const nodeRef = useRef<HTMLDivElement>(null);
  return (
    <Draggable
      nodeRef={nodeRef as React.RefObject<HTMLElement>}
      grid={[80, 80]}
      position={position}
      onDrag={(e, data) => {
        onDrag(project, { x: data.x, y: data.y });
      }}
      onStop={(e, data) => {
        onStop(project, { x: data.x, y: data.y });
      }}
    >
      <Box
        ref={nodeRef}
        cursor="pointer"
        onDoubleClick={() => onDoubleClick(project)}
        position="absolute"
      >
        <Image src="/floppy-disk.png" alt="Floppy Disk Icon" boxSize="64px" />
        <Text mt={2} fontWeight="bold" color="#000">
          {project}
        </Text>
      </Box>
    </Draggable>
  );
}

export default function DesktopPortfolio() {
  const projects = ['Project-1', 'Project-2', 'Project-3', 'Project-4'];
  // Set initial positions for each icon (you can adjust grid spacing here)
  const initialPositions = projects.reduce((acc, project, index) => {
    acc[project] = { x: 20, y: 20 + index * 80 };
    return acc;
  }, {} as Record<string, { x: number; y: number }>);
  const [positions, setPositions] = useState(initialPositions);

  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const { open, onOpen, onClose } = useDisclosure();

  // When dragging, update the position continuously.
  const handleDrag = (project: string, newPos: { x: number; y: number }) => {
    setPositions((prev) => ({
      ...prev,
      [project]: newPos,
    }));
  };

  // When the mouse is released, the onStop event fires.
  // With the grid snapping enabled, data.x/y are already snapped.
  const handleStop = (project: string, newPos: { x: number; y: number }) => {
    setPositions((prev) => ({
      ...prev,
      [project]: newPos,
    }));
  };

  const handleIconDoubleClick = (project: string) => {
    setSelectedProject(project);
    onOpen();
  };

  return (
    <Box
      height="100vh"
      width="100vw"
      overflow="hidden"
      position="relative"
      backgroundImage="url('/background.jpg')"
      backgroundSize="cover"
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
    >
      {/* Container for icons (entire area except bottom taskbar) */}
      <Box position="absolute" top="0" left="0" right="0" bottom="40px">
        {projects.map((project) => (
          <DraggableIcon
            key={project}
            project={project}
            onDoubleClick={handleIconDoubleClick}
            position={positions[project]}
            onDrag={handleDrag}
            onStop={handleStop}
          />
        ))}
      </Box>

      {/* Global Dialog for project details */}
      <Dialog.Root
        open={open}
        onOpenChange={(open) => {
          if (!open) onClose();
        }}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <DialogContent border="2px solid #000" bg="#C0C0C0">
              <DialogHeader borderBottom="2px solid #000" bg="#E0E0E0">
                <Dialog.Title color="#000">{selectedProject}</Dialog.Title>
                <DialogCloseTrigger asChild>
                  <CloseButton size="sm" onClick={onClose} />
                </DialogCloseTrigger>
              </DialogHeader>
              <DialogBody p={4} bg="#C0C0C0">
                <Text color="#000">
                  This is where you can describe the details of {selectedProject}.
                </Text>
              </DialogBody>
            </DialogContent>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      {/* Windows95-style Taskbar */}
      <Box
        position="absolute"
        bottom="0"
        left="0"
        right="0"
        bg="#C0C0C0"
        height="40px"
        display="flex"
        alignItems="center"
        paddingX="10px"
        borderTop="2px solid #fff"
      >
        <Button size="sm" colorScheme="gray" variant="solid">
          Search
        </Button>
      </Box>
    </Box>
  );
}