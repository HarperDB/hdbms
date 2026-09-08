/** HTTP status off an axios-style error, tolerating both the axios shape
 *  (`error.response.status`) and a bare `{ status }`. */
export function errorStatus(err: unknown): number | undefined {
	return (err as { response?: { status?: number } })?.response?.status
		?? (err as { status?: number })?.status;
}
