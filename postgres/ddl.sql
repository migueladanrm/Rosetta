begin;

create extension if not exists "uuid-ossp";

-- Tables

create table public.worker
(
    id   char(8)               not null primary key,
    name character varying(32) not null
);

create table public.operation
(
    id          uuid                    not null primary key default uuid_generate_v4(),
    description character varying(1024) null,
    items       jsonb                   not null             default '[]'::jsonb,
    filters     jsonb                   not null             default '[]'::jsonb,
    is_done     boolean                 not null             default false,
    creation    timestamp               not null             default now()
);

create table public.operation_task
(
    id              uuid                  not null primary key default uuid_generate_v4(),
    operation       uuid                  not null references public.operation (id),
    file_id         char(24)              not null,
    filter          character varying(24) not null,
    assigned_worker character varying(8)  null references public.worker (id),
    assigned_at     timestamp             null,
    finished_at     timestamp             null,
    output_file     char(24)              null
);

-- Triggers

create or replace function register_operation_tasks() returns trigger
    language plpgsql as
$$
declare
    _items   jsonb;
    _filters jsonb;
    _i       jsonb;
    _f       character varying(24);
begin
    select items into _items from operation where id = NEW.id limit 1;
    select filters into _filters from operation where id = NEW.id limit 1;

    for _i in select jsonb_array_elements from jsonb_array_elements(_items)
        loop
            for _f in select jsonb_array_elements from jsonb_array_elements(_filters)
                loop
                    insert into operation_task(operation, file_id, filter) values (NEW.id, (select _i ->> 'id'), _f);
                end loop;
        end loop;

    return new;
end;
$$;

create trigger tr_register_operation_tasks
    after insert
    on public.operation
    for each row
execute procedure register_operation_tasks();


create or replace function update_operation_status() returns trigger
    language plpgsql as
$$
declare
    operation_id    uuid;
    done            bool := true;
    tmp_finished_at timestamp;
begin
    select operation into operation_id from operation_task where operation = new.operation limit 1;

    for tmp_finished_at in select finished_at from operation_task where operation = operation_id
        loop
            if tmp_finished_at is null then
                done := false;
            end if;
        end loop;

    update operation set is_done = done where id = operation_id;

    return new;
end;
$$;

create trigger tr_update_operation_status
    after update
    on public.operation_task
    for each row
execute procedure update_operation_status();

end;