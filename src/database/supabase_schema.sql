create table battery_percentage (
  id serial primary key,
  code text not null,
  dpid integer not null,
  time bigint not null,
  value integer not null
);

create table humidity_value (
  id serial primary key,
  code text not null,
  dpid integer not null,
  time bigint not null,
  value integer not null
);

create table temp_current (
  id serial primary key,
  code text not null,
  dpid integer not null,
  time bigint not null,
  value integer not null
);
