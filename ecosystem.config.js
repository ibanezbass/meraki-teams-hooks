module.exports={
    apps: [
    	{
            name: "meraki-teams-hooks",
            script: "./app.js",
            watch: true,
            'ignore-watch': ['node_modules', '.git'],
            instances: 'max',
            exec_mode: 'cluster',
            env: {
                "NODE_ENV": "development",
            },
            env_production: {
                "NODE_ENV": "production",
            }
        }
    ]
}

