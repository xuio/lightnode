module.exports = {
	server: {
		listen_port: 8080,
		listen_host: '::',

		// drop privileges to:
		// "uid": "www-data",
		// "gid": "www-data"
	},
	presets: [
		{
			label: 'White',
			values: {
				office: { 0: 16,  1: 255,  2: 0,  3: 255,  4: 255,  5: 255, 15: 16, 16: 255, 17: 0, 18: 255, 19: 255, 20: 255 }
			}
		},
		{
			label: 'Natural',
			values: {
				office: { 0: 16,  1: 255,  2: 0,  3: 255,  4: 190,  5: 140, 15: 16, 16: 255, 17: 0, 18: 255, 19: 190, 20: 140 }
			}
		},
		{
			label: 'Worklight',
			values: {
				office: { 0: 16,  1: 130,  2: 0,  3: 255,  4: 165,  5: 0, 15: 1, 16: 255, 17: 0, 18: 255, 19: 190, 20: 140, 21: 0, 22: 0, 23: 0, 24: 255, 25: 190, 26: 140 }
			}
		},
		{
			label: 'Chill',
			values: {
				office: { 0: 16,  1: 255,  2: 0,  3: 255,  4: 39,  5: 0, 15: 1, 16: 255, 17: 0, 18: 255, 19: 255, 20: 0, 21: 0, 22: 0, 23: 0, 24: 128, 25: 0, 26: 255, 31: 255, 32: 60 }
			}
		},
		{
			label: 'Cinema',
			values: {
				office: { 0: 16,  1: 30,  2: 0,  3: 255,  4: 39,  5: 0, 15: 0, 31: 255, 32: 0 }
			}
		},
	],
	universes: {
		DMX: {
			output: {
				// 'driver': 'enttec-usb-dmx-pro',
				// 'device': '/dev/cu.usbserial-6AVNHXS8'
				// 'driver': 'null',
				// 'device': 0
				driver: 'bbdmx',
				device: '192.168.1.110'
			},
			devices: [
				{
					type: 'el-cheapo-spot',
					address: 0
				},
				{
					type: 'el-cheapo-spot',
					address: 9
				},
				{
					type: 'el-cheapo-spot',
					address: 18
				},
				{
					type: 'el-cheapo-spot',
					address: 24
				},
			]
		},
/*		'funk': {
			'output': {
				// 'driver': 'enttec-usb-dmx-pro',
				// 'device': '/dev/cu.usbserial-6AVNHXS8'
				// 'driver': 'null',
				// 'device': 0
				 'driver': 'rcswitch',
				 'device': '/dev/tty.wchusbserial1420'
			},
			'devices': [
				{
					'type': 'wireless-socket',
					'address': 0
				},
				{
					'type': 'wireless-socket',
					'address': 1
				},
				{
					'type': 'wireless-socket',
					'address': 2
				},
				{
					'type': 'wireless-socket',
					'address': 3
				}
			]
		}*/
	}
};
