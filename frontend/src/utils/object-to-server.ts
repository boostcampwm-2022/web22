import { ObjectType, ObjectDataToServer, SocketObjectType } from '@pages/workspace/whiteboard-canvas/types';

import { fabric } from 'fabric';

export const formatObjectDataToServer = (objectGroup: fabric.Group, type: SocketObjectType): ObjectDataToServer => {
	const message: ObjectDataToServer = {
		type: type,
		objectId: objectGroup.objectId,
		left: objectGroup.left,
		top: objectGroup.top,
		width: objectGroup.width,
		height: objectGroup.height,
		scaleX: objectGroup.scaleX || 1,
		scaleY: objectGroup.scaleY || 1,
	};

	objectGroup._objects.forEach((object) => {
		if (object.type === ObjectType.rect) {
			message.color = object.fill as string;
		}
		if (object.type === ObjectType.text || object.type === ObjectType.title) {
			const textObject = object as fabric.Text;
			message.text = textObject.text;
			message.fontSize = textObject.fontSize;
		}
	});
	return message;
};

export const formatMessageToSocketForGroup = (group: fabric.Group, object: fabric.Group): ObjectDataToServer => {
	const groupCenterPoint = group.getCenterPoint();
	const objectDataMessage = formatObjectDataToServer(object, object.type as SocketObjectType);

	const message: ObjectDataToServer = {
		...objectDataMessage,
		left: groupCenterPoint.x + (objectDataMessage.left || 0) * (group.scaleX || 1),
		top: groupCenterPoint.y + (objectDataMessage.top || 0) * (group.scaleY || 1),
		scaleX: (group.scaleX || 1) * (objectDataMessage.scaleX || 1),
		scaleY: (group.scaleY || 1) * (objectDataMessage.scaleY || 1),
	};

	return message;
};

export const formatMoveObjectEventToSocket = (objectGroup: fabric.Group): ObjectDataToServer => {
	const message: ObjectDataToServer = {
		objectId: objectGroup.objectId,
		left: objectGroup.left,
		top: objectGroup.top,
	};

	return message;
};

export const formatMoveObjectEventToSocketForGroup = (
	group: fabric.Group,
	object: fabric.Group
): ObjectDataToServer => {
	const groupCenterPoint = group.getCenterPoint();
	const objectDataMessage = formatMoveObjectEventToSocket(object);

	const message: ObjectDataToServer = {
		...objectDataMessage,
		left: groupCenterPoint.x + (objectDataMessage.left || 0) * (group.scaleX || 1),
		top: groupCenterPoint.y + (objectDataMessage.top || 0) * (group.scaleY || 1),
	};

	return message;
};

export const formatScaleObjectEventToSocket = (object: fabric.Group) => {
	const message: ObjectDataToServer = {
		objectId: object.objectId,
		left: object.left,
		top: object.top,
		scaleX: object.scaleX,
		scaleY: object.scaleY,
	};
	return message;
};

export const formatScaleObjectEventToSocketForGroup = (
	group: fabric.Group,
	object: fabric.Group
): ObjectDataToServer => {
	const groupCenterPoint = group.getCenterPoint();
	const objectDataMessage = formatScaleObjectEventToSocket(object);

	const message: ObjectDataToServer = {
		...objectDataMessage,
		left: groupCenterPoint.x + (objectDataMessage.left || 0) * (group.scaleX || 1),
		top: groupCenterPoint.y + (objectDataMessage.top || 0) * (group.scaleY || 1),
		scaleX: (group.scaleX || 1) * (objectDataMessage.scaleX || 1),
		scaleY: (group.scaleY || 1) * (objectDataMessage.scaleY || 1),
	};
	return message;
};

export const formatEditTextEventToSocket = (object: fabric.Text): ObjectDataToServer => {
	const message: ObjectDataToServer = {
		objectId: object.objectId,
		text: object.text,
		fontSize: object.fontSize,
	};

	return message;
};

export const formatSelectEventToSocket = (objects: fabric.Object[]) => {
	const message = {
		objectIds: objects.map((object) => object.objectId),
	};
	return message;
};