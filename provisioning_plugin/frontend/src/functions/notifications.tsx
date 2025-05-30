import { notifications } from '@mantine/notifications';

/**
 * Show a notification that the feature is not yet implemented
 */
export function notYetImplemented() {
  notifications.hide('not-implemented');

  notifications.show({
    title: `Not implemented`,
    message: `This feature is not yet implemented`,
    color: 'red',
    id: 'not-implemented',
  });
}

/**
 * Show a notification that the user does not have permission to perform the action
 */
export function permissionDenied() {
  notifications.show({
    title: `Permission Denied`,
    message: `You do not have permission to perform this action`,
    color: 'red',
  });
}

/**
 * Display a notification on an invalid return code
 */
export function invalidResponse(returnCode: number) {
  // TODO: Specific return code messages
  notifications.show({
    title: `Invalid Return Code`,
    message: `Server returned status ${returnCode}`,
    color: 'red',
  });
}

/**
 * Display a notification on timeout
 */
export function showTimeoutNotification() {
  notifications.show({
    title: `Timeout`,
    message: `The request timed out`,
    color: 'red',
  });
}
