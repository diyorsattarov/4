cmake_minimum_required(VERSION 3.10)
project(beast-service)

file (GLOB APP_FILES
  beast.hpp
  http_session.cpp
  http_session.hpp
  listener.cpp
  listener.hpp
  main.cpp
  net.hpp
  shared_state.cpp
  shared_state.hpp
  websocket_session.cpp
  websocket_session.hpp
)

source_group ("" FILES ${APP_FILES})

add_executable (beast-service
    ${APP_FILES}
    ${BOOST_BEAST_FILES}
)

target_link_libraries(beast-service pthread ${Boost_SYSTEM_LIBRARY} )

set_property(TARGET beast-service PROPERTY FOLDER "beast-service")