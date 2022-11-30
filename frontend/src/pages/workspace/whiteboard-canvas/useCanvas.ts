import { useRef, useEffect } from 'react';
import { fabric } from 'fabric';
import {
	addObject,
	initDragPanning,
	initWheelPanning,
	initZoom,
	initGrid,
	deleteObject,
	setObjectIndexLeveling,
	setCursorMode,
} from '@utils/fabric.utils';
import { toolItems } from '@data/workspace-tool';
import { useRecoilState, useRecoilValue } from 'recoil';
import { cursorState, zoomState } from '@context/workspace';
import { CanvasType } from './types';
import { myInfoInWorkspaceState } from '@context/user';
import { workspaceRole } from '@data/workspace-role';

function useCanvas() {
	const canvas = useRef<fabric.Canvas | null>(null);
	const [zoom, setZoom] = useRecoilState(zoomState);
	const cursor = useRecoilValue(cursorState);
	const myInfoInWorkspace = useRecoilValue(myInfoInWorkspaceState);

	useEffect(() => {
		if (canvas.current && zoom.event === 'control')
			canvas.current.zoomToPoint({ x: window.innerWidth / 2, y: window.innerHeight / 2 }, zoom.percent / 100);
	}, [zoom]);

	useEffect(() => {
		canvas.current = initCanvas();
		return () => {
			if (canvas.current) {
				canvas.current.dispose();
				canvas.current = null;
			}
		};
	}, []);

	useEffect(() => {
		if (!canvas.current) return;

		const fabricCanvas = canvas.current as fabric.Canvas;
		if (myInfoInWorkspace.role === workspaceRole.GUEST) {
			setCursorMode(fabricCanvas, 'grab', CanvasType.move, false);
		} else {
			if (cursor.type === toolItems.SECTION) {
				setCursorMode(fabricCanvas, 'context-menu', CanvasType.section, true);
			} else if (cursor.type === toolItems.POST_IT) {
				setCursorMode(fabricCanvas, 'context-menu', CanvasType.postit, true);
			} else if (cursor.type === toolItems.MOVE) {
				setCursorMode(fabricCanvas, 'grab', CanvasType.move, false);
			} else if (cursor.type === toolItems.SELECT) {
				setCursorMode(fabricCanvas, 'default', CanvasType.select, true);
			} else {
				setCursorMode(fabricCanvas, 'default', CanvasType.draw, true);
			}
		}
	}, [cursor, myInfoInWorkspace]);

	const initCanvas = () => {
		const grid = 50;
		const canvasWidth = window.innerWidth;
		const canvasHeight = window.innerHeight;

		const fabricCanvas = new fabric.Canvas('canvas', {
			mode: CanvasType.select,
			height: canvasHeight,
			width: canvasWidth,
			backgroundColor: '#f1f1f1',
		});

		initGrid(fabricCanvas, canvasWidth, canvasHeight, grid);
		initZoom(fabricCanvas, setZoom);
		initDragPanning(fabricCanvas);
		initWheelPanning(fabricCanvas);
		addObject(fabricCanvas, 'NAME');
		deleteObject(fabricCanvas);
		setObjectIndexLeveling(fabricCanvas);

		return fabricCanvas;
	};

	return {
		canvas,
	};
}

export default useCanvas;
