[program:process-{{$process->id}}]
command={{$process->command}}

process_name=%(program_name)s_%(process_num)02d
autostart=true
autorestart=true
user={{$process->user}}
numprocs={{$process->process_count}}
redirect_stderr=true
stdout_logfile=/root/.serverdesk/process/process-{{$process->id}}.log
